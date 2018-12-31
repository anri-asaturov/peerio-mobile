const { iOS } = require('../platforms');
const ChatActionSheetPage = require('../pages/popups/actionSheetPage/iOSChatActionSheetPage');
const FileUploadPage = require('../pages/files/fileUploadPage/iOSFileUploadPage');
const IosSettingsPage = require('../pages/settings/IosSettingsPage');

class iOSFactory {
    get bundleId() {
        return 'com.peerio';
    }

    get platform() {
        return iOS;
    }

    chatActionSheetPage(app) {
        return new ChatActionSheetPage(app);
    }

    fileUploadPage(app) {
        return new FileUploadPage(app);
    }

    settingsPage(app) {
        return new IosSettingsPage(app);
    }
}

module.exports = new iOSFactory();
