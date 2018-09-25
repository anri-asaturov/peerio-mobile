import { Platform, NativeModules } from 'react-native';
import RNFS from 'react-native-fs';
import FileOpener from 'react-native-file-opener';
import pathUtils from 'path';
import mime from 'mime-types';

const icebear = require('./peerio-icebear');

const { fileHelpers } = icebear;
const { bytesToB64, b64ToBytes } = icebear.crypto.cryptoUtil;

const isIOS = Platform.OS === 'ios';
const ROOT = isIOS ? RNFS.CachesDirectoryPath : RNFS.ExternalDirectoryPath;

function getTemporaryDirectory() {
    return pathUtils.join(ROOT, 'cache');
}

const ASSET_PROTOCOL = 'asset://';

export default fileStream => {
    class RNFileStream extends fileStream {
        async open() {
            if (this.mode === 'read') {
                this.fileDescriptor = this.filePath;
                if (this.filePath.startsWith(ASSET_PROTOCOL)) {
                    this.isAsset = true;
                    this.filePath = RNFileStream.formatAssetsPath(
                        this.filePath.replace(ASSET_PROTOCOL, '')
                    );
                } else {
                    const { size } = await RNFS.stat(this.filePath);
                    this.size = size;
                }
            } else if (this.mode === 'write') {
                // delete existing file if it is write mode
                if (await RNFileStream.exists(this.filePath)) {
                    await RNFileStream.delete(this.filePath);
                }
                await RNFS.mkdir(pathUtils.dirname(this.filePath));
                this.fileDescriptor = this.filePath;
            }
        }

        close() {
            if (this.fileDescriptor == null) return Promise.resolve();
            this.fileDescriptor = null;
            console.debug(
                `rn-file-stream.js successfully ${this.mode}: ${this.filePath}`
            );
            return Promise.resolve();
        }

        /**
         *
         * @return {Promise<number>}
         */
        async readInternal(size) {
            // if the file is asset we use a special function to read it
            // because of android
            const contents = await (this.isAsset
                ? RNFileStream.readAssetsFile(this.filePath, 'base64')
                : RNFS.readFileChunk(this.filePath, this.pos, size));
            return b64ToBytes(contents);
        }

        /**
         * Move file position pointer
         * @param {number} pos
         */
        seekInternal(pos) {
            this.pos = pos;
            const fd = this.fileDescriptor;
            if (fd) {
                fd.position = pos;
                return fd.position;
            }
            throw new Error('rn-file-stream.js: stream is not initialized');
        }

        /**
         * @param {Uint8Array} buffer
         * @return {Promise}
         */
        writeInternal(buffer) {
            return RNFS.appendFile(
                this.fileDescriptor,
                bytesToB64(buffer),
                'base64'
            );
        }

        static getFullPath(uid, name) {
            return `${ROOT}/${uid}/${name}`;
        }

        static exists(path) {
            return RNFS.exists(path);
        }

        /**
         * Launch external viewer
         */
        static launchViewer(path, title) {
            console.debug(`rn-file-stream.js: opening viewer for ${path}`);
            const extension = fileHelpers.getFileExtension(path);
            const mimeType = extension ? mime.types[extension] : 'image/jpeg';
            return FileOpener.open(path, mimeType, title || path);
        }

        static getStat(path) {
            // TODO: may use readDirAssets to determine size
            // for android assets size returns as 0
            // for uniformity, we return same size for iOS, too
            if (path.startsWith(ASSET_PROTOCOL)) return { size: 0 };
            return RNFS.stat(path);
        }

        /**
         * @returns {Promise<string[]>}
         */
        static getCacheList() {
            return RNFS.readDir(ROOT).then(items => {
                return items.filter(i => i.isFile()).map(i => i.path);
            });
        }

        static delete(path) {
            return RNFS.unlink(path);
        }

        static async rename(oldPath, newPath) {
            if (oldPath === newPath) {
                console.log(
                    `rn-file-stream: ${oldPath} equals to new destination`
                );
                return;
            }
            if (await RNFS.exists(newPath)) {
                await RNFS.unlink(newPath);
            }
            await RNFS.moveFile(oldPath, newPath);
        }

        static getTempCachePath(name) {
            return pathUtils.join(getTemporaryDirectory(), name);
        }

        static formatAssetsPath(path) {
            return Platform.OS === 'ios'
                ? `${RNFS.MainBundlePath}/${path}`
                : path;
        }

        static makeAssetPath(path) {
            return `${ASSET_PROTOCOL}${path}`;
        }

        static readAssetsFile = (isIOS
            ? RNFS.readFile
            : RNFS.readFileAssets
        ).bind(RNFS);

        static existsAssetsFile = (isIOS
            ? RNFS.exists
            : RNFS.existsAssets
        ).bind(RNFS);
    }

    return RNFileStream;
};

/**
 * Get encryption status of the filesystem
 * For iOS we assume it's always active
 * For Android:
 * @return {int} 0 - inactive, 1 - active with default pin, 2 - active
 */
function getEncryptionStatus() {
    const api = NativeModules.RNFSManager.getEncryptionStatus;
    if (!api) return Promise.resolve(2); // we are on iOS
    return api();
}

getEncryptionStatus().then(status => {
    console.log(`rn-file-stream.js: encryption ${status}`);
    global.fileEncryptionStatus = status;
});
