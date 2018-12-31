const SettingsPage = require('./settingsPage');

const { selectorWithPartialText } = require('../../helpers/androidHelper');

class AndroidSettingsPage extends SettingsPage {
    checkIfWebsiteHasOpened() {
        const myUrl = selectorWithPartialText('support.peerio.com');
        return this.getWhenVisible(myUrl);
    }
}

module.exports = AndroidSettingsPage;
