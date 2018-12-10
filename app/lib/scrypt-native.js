import { NativeModules } from 'react-native';
import { b64ToBytes, bytesToB64 } from './peerio-icebear/crypto/util';

/**
 * This is a JS bridge to native implementation of
 * scrypt, sign and verify functions
 * Native implementations speed up our crypto primitives
 * 100x times
 */

function scryptNative(password, salt, options, callback) {
    const passwordB64 = bytesToB64(password);
    const saltB64 = bytesToB64(salt);
    options.p = options.p || 1;
    const { N, r, p, dkLen } = options;
    const start = new Date().getTime();
    return NativeModules.RNSodium.scrypt(passwordB64, saltB64, N, r, p, dkLen)
        .then(result => callback(b64ToBytes(result)))
        .then(() => console.log(`scrypt-worker.js: executed in ${new Date().getTime() - start}`));
}

function signDetachedNative(message, secretKey) {
    const messageB64 = bytesToB64(message);
    const secretKeyB64 = bytesToB64(secretKey);
    return NativeModules.RNSodium.signDetached(messageB64, secretKeyB64).then(b64ToBytes);
}

function verifyDetachedNative(message, signature, publicKey) {
    const messageB64 = bytesToB64(message);
    const signatureB64 = bytesToB64(signature);
    const publicKeyB64 = bytesToB64(publicKey);
    return NativeModules.RNSodium.verifyDetached(messageB64, signatureB64, publicKeyB64).catch(
        () => false
    );
}

module.exports = {
    scryptNative,
    signDetachedNative,
    verifyDetachedNative
};
