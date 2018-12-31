const SettingsPage = require('./settingsPage');

class IosSettingsPage extends SettingsPage {
    checkIfWebsiteHasOpened() {
        console.log('Stub');
        return true;
    }
}

module.exports = IosSettingsPage;
