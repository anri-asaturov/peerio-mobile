import * as icebear from './peerio-icebear';
import './btoa-shim';
import mobileConfig from './mobile-config';

/**
 * This file imports peerio-icebear and provides
 * it with platform-specific config and shims
 */

declare const global: GlobalExtended;
declare const window: GlobalExtended;

// this is for websocketio
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'react-native';

const { socket, config, FileStreamBase, telemetry, TinyDb } = icebear;
mobileConfig(config, { FileStreamBase }, telemetry);

// the following code adds the capability to override the server
// using the debug menu on mobile.
const OVERRIDE_SERVER_KEY = 'socketServerOverride';

async function overrideServer(value: string) {
    return value
        ? TinyDb.system.setValue(OVERRIDE_SERVER_KEY, value)
        : TinyDb.system.removeValue(OVERRIDE_SERVER_KEY);
}

async function startSocket() {
    const serverOverride = await TinyDb.system.getValue(OVERRIDE_SERVER_KEY);
    if (serverOverride) {
        console.log('icebear.js: Overriding server name');
        config.socketServerUrl = serverOverride;
    }
    console.log(`icebear.js: Starting connection to ${config.socketServerUrl}`);
    socket.start(config.socketServerUrl);
}

global.icebear = icebear;
// eslint-disable-next-line
if (window) window.icebear = icebear;

export * from './peerio-icebear';
export { overrideServer, startSocket };
