const Page = require('../page');

class TwoStepVerificationPage extends Page {
    get secretKey() {
        return this.getWhenVisible('~secretKey');
    }

    get confirmationCode() {
        return this.getWhenVisible('~confirmationCodeInput');
    }

    get confirmButton() {
        return this.getWhenVisible('~button_confirm');
    }

    get backupCodesVisible() {
        return this.getWhenVisible('~title_2FABackupCode');
    }
}

module.exports = TwoStepVerificationPage;
