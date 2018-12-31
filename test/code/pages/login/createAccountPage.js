const Page = require('../page');

class CreateAccountPage extends Page {
    get firstName() {
        return this.getWhenVisible('~firstName');
    }

    get lastName() {
        return this.getWhenVisible('~lastName');
    }

    get username() {
        return this.getWhenVisible('~username');
    }

    get email() {
        return this.getWhenVisible('~email');
    }

    get nextButton() {
        return this.getWhenEnabled('~button_next');
    }

    get createButton() {
        return this.getWhenEnabled('~button_create');
    }

    get copyButton() {
        return this.getWhenEnabled('~button_copy');
    }

    get acceptButton() {
        return this.getWhenEnabled('~button_accept');
    }

    get shareButton() {
        return this.getWhenEnabled('~button_share');
    }

    get passphrase() {
        return this.getWhenVisible('~passphrase');
    }

    get confirmInput() {
        return this.getWhenVisible('~confirmText');
    }

    get finishButton() {
        return this.getWhenEnabled('~button_finish');
    }

    get skipButton() {
        return this.getWhenEnabled('~button_skip');
    }
}

module.exports = CreateAccountPage;
