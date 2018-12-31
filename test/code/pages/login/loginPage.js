const Page = require('../page');

class LoginPage extends Page {
    get usernamePresent() {
        return this.checkIfPresent('~usernameLogin');
    }

    get username() {
        return this.getWhenVisible('~usernameLogin');
    }

    get passphrase() {
        return this.getWhenVisible('~usernamePassword');
    }

    get submitButton() {
        return this.getWhenEnabled('~button_login');
    }

    get backButtonVisible() {
        return this.checkIfVisible('~button_back');
    }

    get backButton() {
        return this.getWhenVisible('~button_back');
    }
}

module.exports = LoginPage;
