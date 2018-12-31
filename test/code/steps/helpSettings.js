const { When, Then } = require('cucumber');

When('I go to help settings', async function() {
    await this.homePage.settingsTab.click();
    await this.settingsPage.helpButton.click();
});

When('I tap Chat button in help settings', async function() {
    await this.settingsPage.chatButton.click();
});

When('I tap Send button in help settings', async function() {
    await this.settingsPage.sendButton.click();
});

When('an e-mail opens in the native e-mail app', async function() {
    // TODO: native e-mail check
    return 'pending';
});

When('I tap Visit button in help settings', async function() {
    await this.settingsPage.visitButton.click();
});

Then('the Peerio Zendesk opens in browser', async function() {
    // should throw if not found for android
    // should just continue on iOS
    await this.settingsPage.checkIfWebsiteHasOpened();
});
