const { Given, Then } = require('cucumber');

Given('I enable 2FA', async function() {
    await this.goTo2FASetup();
});

Given('I enter the correct token', async function() {
    await this.enterTokenInSettings();
});

Then('I am prompted to enter a 2FA token', async function() {
    await this.enterTokenInPrompt();
});

Given('I enable 2FA on a trusted device', async function() {
    await this.goTo2FASetup();
    await this.enterTokenInSettings();
    await this.app.closeApp();
    await this.app.launch();
    await this.twoFactorAuthPrompt.trustDeviceCheckbox.click();
    await this.enterTokenInPrompt();
});

Given('I enable 2FA on an untrusted device', async function() {
    await this.goTo2FASetup();
    await this.enterTokenInSettings();
    await this.app.closeApp();
    await this.app.launch();
    await this.enterTokenInPrompt();
});
