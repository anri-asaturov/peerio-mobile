import { Platform, AsyncStorage, NativeModules } from 'react-native';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'peerio-react-native-fetch-blob';
import FileOpener from 'react-native-file-opener';
import { fromByteArray, toByteArray } from 'base64-js';

export default (fileStream) => {
    class RNFileStream extends fileStream {

        open() {
            if (this.mode === 'read') {
                this.fileDescriptor = this.filePath; // read stream doesn't really have descriptor
                return RNFS.stat(this.filePath)
                    .then(s => {
                        this.size = s.size;
                        return this;
                    });
            }
            return RNFetchBlob.fs.writeStream(this.filePath, 'base64', this.mode === 'append')
                .then(fd => {
                    this.fileDescriptor = fd;
                    return this;
                });
        }

        close() {
            if (this.fileDescriptor == null) return Promise.resolve();
            if (this.mode === 'read') {
                this.fileDescriptor = null;
                console.log('imagepicker.js successfully read: ', this.filePath);
                return Promise.resolve();
            }
            return this.fileDescriptor.close()
                .then(() => {
                    console.log('imagepicker.js successfully written: ', this.filePath);
                    this.fileDescriptor = null;
                });
        }

        /**
         *
         * @return {Promise<number>}
         */
        readInternal(size) {
            return RNFS.readFileChunk(this.filePath, this.pos, size)
                        .then(contents => toByteArray(contents));
        }

        /**
         * Move file position pointer
         * @param {number} pos
         */
        seekInternal(pos) {
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
            return this.fileDescriptor.write(fromByteArray(buffer)).return(buffer);
        }

        static getFullPath(name) {
            const path = Platform.OS === 'ios' ? RNFS.CachesDirectoryPath : RNFS.ExternalDirectoryPath;
            return `${path}/${name}`;
        }

        static exists(path) {
            return RNFS.exists(path);
        }

        /**
         * Launch external viewer
         */
        static launchViewer(path) {
            console.log(`rn-file-stream.js: opening viewer for ${path}`);
            FileOpener.open(path, 'image/jpeg');
        }
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
