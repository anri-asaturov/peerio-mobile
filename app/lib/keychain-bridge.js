import { NativeModules, Platform } from 'react-native';
import { observable } from 'mobx';

const { RNKeychain } = NativeModules;

/**
 * This is the interface to react-native-keychain
 * module which ships with the app
 */

class KeychainBridge {
    get hasPlugin() {
        return !!RNKeychain;
    }

    async isIosPasscodeUnset() {
        if (Platform.OS !== 'ios') return false;
        try {
            return !(await RNKeychain.isPasscodeSet());
        } catch (e) {
            console.log(e.message);
            console.log(e.code);
            console.log(e);
            return true;
        }
    }

    @observable available = false;

    load = async () => {
        if (!RNKeychain) return;
        this.available = await RNKeychain.isFeatureAvailable();
        console.log(`keychain-bridge.js: ${this.available}`);
    };

    async save(key, value, secureWithTouchID) {
        console.debug(`keychain-bridge.js: saving ${key}:${value.length}`);
        try {
            await RNKeychain.saveValue(value, key, secureWithTouchID);
            return true;
        } catch (e) {
            console.log(`keychain-bridge.js: error saving ${key} [${secureWithTouchID}]`);
            console.log(e.message);
            console.log(e.code);
            console.log(e);
            return false;
        }
    }

    get(key) {
        console.debug(`keychain-bridge.js: requesting ${key}`);
        return RNKeychain.getValue(key).catch(e => {
            console.log(`keychain-bridge.js: returned error from ${key}`);
            console.log(e.message);
            return Promise.resolve(null);
        });
    }

    delete(key) {
        console.debug(`keychain-bridge.js: deleting ${key}`);
        return RNKeychain.deleteValue(key).catch(() => {
            console.debug(`touchdid-bridge.js: error deleting ${key}`);
            return Promise.resolve(null);
        });
    }
}

const keychain = new KeychainBridge();
global.keychain = keychain;
export default keychain;
