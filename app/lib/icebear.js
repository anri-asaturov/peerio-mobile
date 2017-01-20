import './btoa-shim';
import rnFileStream from './rn-file-stream';
import { engine } from '../store/local-storage';

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'react-native';

const icebear = require('./peerio-icebear/src');

const { socket, config, FileStreamAbstract } = icebear;

config.download.maxDownloadChunkSize = 1024 * 1024;
config.download.maxDecryptBufferSize = 1024 * 1024 * 2;
config.upload.encryptBufferSize = 1024 * 1024;
config.upload.uploadBufferSize = 1024 * 1024;

config.isMobile = true;
config.socketServerUrl = process.env.PEERIO_SOCKET_SERVER || 'wss://app.peerio.com';
config.FileStream = rnFileStream(FileStreamAbstract);
config.TinyDb = engine;

socket.start();

module.exports = icebear;
global.icebear = icebear;
