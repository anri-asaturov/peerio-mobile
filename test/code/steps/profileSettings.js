const { When, Then } = require('cucumber');

When('I go to public profile settings', async function() {
    await this.homePage.settingsTab.click();
    await this.settingsPage.publicProfileButton.click();
});

Then('I change my first name', async function() {
    const newFirstName = new Date().getTime();
    await this.profileSettingsPage.firstName.setValue(newFirstName);
    await this.profileSettingsPage.hideKeyboardHelper();
    await this.profileSettingsPage.lastName.click(); // click something to submit form
    const newFullName = await this.profileSettingsPage.fullName.getText();
    if (!newFullName.includes(newFirstName)) {
        console.error('Full name does not contain new first name');
        console.error(`Expected new first name to be { ${newFirstName} }
        but could not find substring in { ${newFullName} }`);
        this.app.fail();
    }
});

Then('I change my last name', async function() {
    const newLastName = new Date().getTime();
    await this.profileSettingsPage.lastName.setValue(newLastName);
    await this.profileSettingsPage.hideKeyboardHelper();
    await this.profileSettingsPage.firstName.click(); // click something to submit form
    const newFullName = await this.profileSettingsPage.fullName.getText();
    if (!newFullName.includes(newLastName)) {
        console.error('Full name does not contain new last name');
        console.error(`Expected new last name to be { ${newLastName} }
        but could not find substring in { ${newFullName} }`);
        this.app.fail();
    }
});

Then('I upload a new avatar', async function() {
    await this.profileSettingsPage.uploadAvatarIcon.click();
    await this.fileUploadPage.uploadCropImageFromCamera();
    const avatarLetterDisappeared = await this.profileSettingsPage.avatarLetterDisappeared;
    avatarLetterDisappeared.should.be.true; // eslint-disable-line
});

Then('I change my existing avatar', async function() {
    await this.profileSettingsPage.currentAvatar.click();
    await this.fileUploadPage.uploadCropImageFromCamera();
    const avatarLetterDisappeared = await this.profileSettingsPage.avatarLetterDisappeared;
    avatarLetterDisappeared.should.be.true; // eslint-disable-line
});

When('I go to security settings', async function() {
    await this.homePage.settingsTab.click();
    await this.settingsPage.securityButton.click();
});

When('I can see my account key', async function() {
    await this.settingsPage.showAccountKeyButton.click();

    const passphrase = await this.settingsPage.passphraseLabel.getText();
    passphrase.should.equal(this.passphrase);

    await this.settingsPage.copyButton.click();
});
