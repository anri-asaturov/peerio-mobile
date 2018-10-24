const { existingUsers } = require('../helpers/userHelper');

const { defineSupportCode } = require('cucumber');
// const { waitForEmail } = require('peerio-icebear/test/e2e/code/helpers/maildrop.js');
// const { getUrl } = require('peerio-icebear/test/e2e/code/helpers/https.js');

// const emailConfirmUrlRegex = /"(https:\/\/hocuspocus\.peerio\.com\/confirm-address\/.*?)"/;
// const primaryEmailConfirmSubject = 'Welcome to Peerio (Staging)! Confirm your account.';

async function confirmPrimaryEmail(emailAddress) {
    // const email = await waitForEmail(emailAddress, primaryEmailConfirmSubject);
    // const url = emailConfirmUrlRegex.exec(email.body)[1];
    // await getUrl(url);
}

defineSupportCode(({ Given, When, Then }) => {
    // Scenario: User signs up successfully
    When('I choose the create account option', function () {
        return this.selectCreateAccount();
    });

    When('I input my personal info', async function () {
        await this.typePersonalInfo();
    });

    Then('I am presented with my passcode', async function () {
        await this.savePasscode();
    });

    Then('I am taken to the Login Start screen', async function () {
        await this.startPage.loginButton;
    });

    Then('I am taken to the home tab', function () {
        return this.seeWelcomeScreen();
    });

    // Scenario: Autologin
    Given('I have signed up', async function () {
        await this.createNewAccount();
    });

    Given('I close Peerio', async function () {
        await this.app.closeApp();
    });

    When('I open Peerio', async function () {
        await this.app.launch();
    });

    Given('I sign out', async function () {
        await this.logout();
    });

    When('I sign in', async function () {
        await this.loginExistingAccountWithout2FA(this.username, this.passphrase);
    });

    When('I sign in with 2fa', async function () {
        await this.loginExistingAccountWith2FA(this.username, this.passphrase);
    });

    When('I log in as {word} user', async function (string) {
        if (string === 'new') {
            await this.createNewAccount();
        } else {
            const credentials = existingUsers[string];
            await this.loginExistingAccountWithout2FA(credentials.name, credentials.passphrase);
        }
    });

    // this.username needs to be set by a previous step definition
    Then('They sign up', async function () {
        await this.createNewAccount(this.username);
    });

    // this.email needs to be set by a previous step definition
    Then('They confirm their email', async function () {
        await confirmPrimaryEmail(this.email);
    });
});

