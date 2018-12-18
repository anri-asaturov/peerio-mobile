const Page = require('../page');
const { selectorWithText } = require('../../helpers/androidHelper');

class FileViewPage extends Page {
    get fileOpenButton() {
        return this.getWhenEnabled(`~popupButton-open`);
    }

    get fileDownloadButton() {
        return this.getWhenEnabled(`~popupButton-download`);
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
