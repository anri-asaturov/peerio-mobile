const Page = require('../page');

class SettingsPage extends Page {
    get publicProfileButton() {
        return this.getWhenVisible('~title_settingsProfile');
    }

    get uploadAvatarIcon() {
        return this.getWhenVisible('~uploadAvatar');
    }

    get logoutButton() {
        return this.getWhenPresent('~button_logout');
    }

    get securityButton() {
        return this.getWhenVisible('~title_settingsSecurity');
    }

    get twoStepVerificationButton() {
        return this.getWhenVisible('~title_2FA');
    }

    get lockButton() {
        return this.getWhenVisible('~popupButton-yes');
    }

    get showAccountKeyButton() {
        return this.getWhenVisible('~title_showAccountKey');
    }

    get passphraseLabel() {
        return this.getWhenVisible('~textControl');
    }

    get copyButton() {
        return this.getWhenVisible('~popupButton-copy');
    }

    get helpButton() {
        return this.getWhenPresent('~title_help');
    }

    get chatButton() {
        return this.getWhenVisible('~button_chat');
    }
}

module.exports = SettingsPage;
