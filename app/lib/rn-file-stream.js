import RNFS from 'react-native-fs';
import RNFetchBlob from 'peerio-react-native-fetch-blob';
import FileOpener from 'react-native-file-opener';
import { fromByteArray, toByteArray } from 'base64-js';

export default (fileStream) => {
    class RNFileStream extends fileStream {
        constructor(filePath, mode, bufferSize) {
            super(filePath, mode, bufferSize);
            // private buffer based on same chunk of RAM (ArrayBuffer) as public buffer
            if (this.buffer) this._buffer = Buffer.from(this.buffer.buffer);
        }

        open() {
            if (this.mode === 'read') {
                this.fileDescriptor = { mock: this.filePath, position: 0 };
                return RNFS.stat(this.filePath).then(s => s.size);
                // return RNFS.readFile(this.filePath, 'base64')
                //     .then((contents) => {
                //         this.fileDescriptor = { mock: this.filePath, position: 0 };
                //         return new Promise((resolve) => {
                //             setTimeout(() => {
                //                 this.contents = Buffer.from(toByteArray(contents));
                //                 const size = this.contents.byteLength;
                //                 this.fileDescriptor.size = size;
                //                 console.log(`imagepicker.js: file size ${size}`);
                //                 return resolve(size);
                //             });
                //         });
                //     });
            }
            // this.contents = ''; // this.fileDescriptor = 1; // return Promise.resolve();
            return RNFetchBlob.fs.writeStream(this.filePath, 'base64', false)
                .then(fd => {
                    this.fileDescriptor = fd;
                    this.contents = 0;
                    // resolve with filesize
                    return 0;
                });
        }

        close() {
            if (this.fileDescriptor == null) return Promise.resolve();
            if (this.mode === 'read') {
                this.fileDescriptor = null;
                this.contents = null;
                console.log('imagepicker.js successfully read: ', this.filePath);
                return Promise.resolve();
            }
            return this.fileDescriptor.close()
                .then(() => {
                    console.log('imagepicker.js successfully written: ', this.filePath);
                    this.contents = null;
                    this.fileDescriptor = null;
                });
        }

        /**
         *
         * @return {Promise<number>}
         */
        readInternal() {
            const fd = this.fileDescriptor;
            const chunkSize = this._buffer.byteLength;

            return RNFS.readFileChunk(this.filePath, fd.position, chunkSize)
                .then(contents => {
                    const chunk = Buffer.from(toByteArray(contents));
                    const size = chunk.byteLength;
                    chunk.copy(this._buffer, 0, 0, size);
                    fd.position += size;
                    // console.log(`rn-file-stream.js: ${fd.position}`);
                    return size;
                });
        }

        /**
         * @param {Uint8Array} buffer
         * @return {Promise}
         */
        writeInternal(buffer) {
            this.contents += buffer.byteLength;
            // console.log('imagepicker.js: next block', this.contents);
            return this.fileDescriptor.write(fromByteArray(buffer));
        }

        static useCache = true
        static chunkSize = 100 * 1024

        static cachePath(name) {
            return `${RNFS.CachesDirectoryPath}/${name}`;
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

    fileStream.FileStream = RNFileStream;
};
