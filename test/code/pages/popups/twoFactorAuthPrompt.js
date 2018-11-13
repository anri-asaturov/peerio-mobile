const Page = require('../page');

class TwoFactorAuthPrompt extends Page {
    get tokenInputPresent() {
        return this.checkIfPresent('~2faTokenInput');
    }
    get tokenInput() {
        return this.getWhenVisible('~2faTokenInput');
    }

    get trustDeviceCheckbox() {
        return this.getWhenVisible('~trustDevice');
    }

    get submitButton() {
        return this.getWhenVisible('~button-ok');
    }
}

module.exports = TwoFactorAuthPrompt;
