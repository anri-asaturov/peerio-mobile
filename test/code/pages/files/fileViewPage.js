const Page = require('../page');
const { selectorWithText } = require('../../helpers/androidHelper');

class FileViewPage extends Page {
    get fileDownloadButton() {
        return this.getWhenEnabled(`~button-file-download`);
    }

    get fileOpenButton() {
        return this.getWhenEnabled(`~button-open`);
    }
    get encryptionRecommendationPopup() {
        const cancelButtonSelector = selectorWithText('CANCEL');
        return this.getWhenVisible(cancelButtonSelector);
    }

    get filesDecryptedPopup() {
        const okButtonSelector = selectorWithText('OK');
        return this.getWhenVisible(okButtonSelector);
    }
}

module.exports = FileViewPage;
