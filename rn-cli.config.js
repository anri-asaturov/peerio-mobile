var blacklist = require('metro/src/blacklist');
var path = require('path');

var projectRoot = path.resolve(__dirname);

// As the metro bundler does not support linking correctly, we add additional
// search path queries to all modules.
const extraNodeModulesGetter = {
    get: (target, name) => {
        if (name === 'crypto') {
            return path.join(projectRoot, 'app/lib/crypto');
        }
        if (name === 'minipdf_js.js') {
            throw new Error('Throw minipdf js');
        }
    }
};

var config = {
    getBlacklistRE() {
        return blacklist([/app\/lib\/peerio-icebear\/node_modules\/.*/]);
    },
    getTransformModulePath() {
        return require.resolve('react-native-typescript-transformer');
    },
    getSourceExts() {
        return ['ts', 'tsx'];
    },
    extraNodeModules: new Proxy({}, extraNodeModulesGetter)
};
console.log('loading custom config for packager');
console.log(`config root: ${projectRoot}`);
module.exports = config;
