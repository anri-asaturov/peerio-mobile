import './btoa-shim';
import mobileConfig from './mobile-config';

global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'react-native';

const icebear = require('./peerio-icebear');
const { getFirstLetterUpperCase } = require('./peerio-icebear/helpers/string');

icebear.getFirstLetterUpperCase = getFirstLetterUpperCase;

const { socket, config, FileStreamBase, telemetry, TinyDb } = icebear;
mobileConfig(config, { FileStreamBase }, telemetry);

const OVERRIDE_SERVER_KEY = 'socketServerOverride';

icebear.overrideServer = async function(value) {
    return value ?
        TinyDb.system.setValue(OVERRIDE_SERVER_KEY, value) :
        TinyDb.system.removeValue(OVERRIDE_SERVER_KEY);
};

icebear.startSocket = async function() {
    const serverOverride = await TinyDb.system.getValue(OVERRIDE_SERVER_KEY);
    if (serverOverride) {
        console.log('icebear.js: Overriding server name');
        config.socketServerUrl = serverOverride;
    }
    /* SERVER OVERRIDE FOR THE CASES OF PROD SERVER RELEASE BEING AFTER APPLE REVIEW
    else {
        // we check current prod server and if it is not yet released, fallback to secondary
        try {
            const result = await fetch(config.socketServerUrl.replace('wss:', 'https:'));
            const text = await result.text();
            console.log(`Server info: ${text}`);
            if (config.preferredServerVersion && !text.includes(config.preferredServerVersion)) {
                console.log(`Server does not match preferred version: ${config.preferredServerVersion}`);
                console.log(`Switching to: ${config.appleTestServer}`);
                config.socketServerUrl = config.appleTestServer;
            } else {
                console.log(`Server matches preferred version: ${config.preferredServerVersion}`);
            }
        } catch (e) {
            console.error(e);
        }
    } */
    console.log(`icebear.js: Starting connection to ${config.socketServerUrl}`);
    socket.start();
};

global.icebear = icebear;
// eslint-disable-next-line
if (window) window.icebear = icebear;
module.exports = icebear;
