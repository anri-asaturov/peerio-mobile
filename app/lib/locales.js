import { config } from '../lib/icebear';

/**
 * This file loads localization files from local resources
 */

export default {
    async loadLocaleFile(lc) {
        const defaultLocale = require('peerio-icebear/src/copy/en.json');
        if (lc === 'en') return defaultLocale;
        const path = config.FileStream.formatAssetsPath(`locales/${lc}.json`);
        try {
            if (await config.FileStream.existsAssetsFile(path)) {
                const file = await config.FileStream.readAssetsFile(path);
                return JSON.parse(file);
            }
        } catch (e) {
            console.error(e);
        }
        return defaultLocale;
    },

    loadDictFile(lc) {
        const path = config.FileStream.formatAssetsPath(`dict/${lc}.txt`);
        const def = config.FileStream.formatAssetsPath(`dict/en.txt`);
        return config.FileStream.existsAssetsFile(path)
            .then(exists => config.FileStream.readAssetsFile(exists ? path : def))
            .catch(e => {
                console.error(e);
                return def;
            });
    },

    loadAssetFile(name) {
        const path = config.FileStream.formatAssetsPath(`${name}`);
        return config.FileStream.existsAssetsFile(path).then(
            exists => (exists ? config.FileStream.readAssetsFile(path) : '')
        );
    }
};
