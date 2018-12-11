const { Then, When } = require('cucumber');

Then(/(?:I|they) navigate to files/, async function() {
    await this.homePage.filesTab.click();
    if (this.filesListPage.buttonFolderBackExists) this.filesListPage.buttonFolderBack.click();
});

Then('the Files tab is empty', async function() {
    await this.homePage.filesTab.click();
    await this.filesListPage.placeholder;
});

Then('I create a folder named {string}', async function(word) {
    await this.filesListPage.uploadFileButtton.click();

    await this.filesListPage.createFolderOption.click();
    await this.filesListPage.folderNameInput.setValue(word);
    await this.filesListPage.hideKeyboardHelper();
    await this.filesListPage.acceptFolderName.click();
});

// TODO Merge this definition with the above? Not sure about Syntax
When('they create a folder named {string}', async function(word) {
    await this.filesListPage.uploadFileButtton.click();

    await this.filesListPage.createFolderOption.click();
    await this.filesListPage.folderNameInput.setValue(word);
    await this.filesListPage.hideKeyboardHelper();
    await this.filesListPage.acceptFolderName.click();
});

Then('I open the {string} folder', async function(word) {
    await this.filesListPage.folderNamed(word).click();
});

Then(/(?:I|they) upload a file/, async function() {
    await this.filesListPage.uploadFileButtton.click();
    await this.fileUploadPage.uploadFileFromGallery();
    await this.filesListPage.fileNameInput.setValue('Iceland');
    await this.filesListPage.hideKeyboardHelper();
    await this.filesListPage.fileUploadedPopup.click();
});

Then('I delete the folder named {string}', async function(word) {
    await this.homePage.filesTab.click();
    await this.filesListPage.optionsButttonFor(word).click();
    await this.filesListPage.deleteOption.click();
    await this.filesListPage.confirmDelete.click();
});

Then('I move the file in the folder named {string}', async function(word) {
    await this.homePage.filesTab.click();

    await this.filesListPage.optionsButttonFor('Iceland').click();
    await this.filesListPage.moveOption.click();

    await this.filesListPage.folderNamed(word).click();
});

// Works for File or Folder because it uses selector
Then('the file is present', async function() {
    await this.filesListPage.folderNamed('Iceland');
});

Then('the {string} folder is present', async function(word) {
    await this.filesListPage.folderNamed(word);
});

Then('I move the {string} folder in the {string} folder', async function(toMove, parent) {
    await this.filesListPage.optionsButttonFor(toMove).click();
    await this.filesListPage.moveOption.click();
    await this.filesListPage.folderNamed(parent).click();
});

Then('they invite {word} user to share {string}', async function(user, folderName) {
    let invitee = user;
    if (user === 'recent') invitee = this.username;

    await this.filesListPage.optionsButttonFor(folderName).click();
    await this.filesListPage.shareOption.click();

    await this.contactSelectorPage.textInput.setValue(invitee);
    await this.contactSelectorPage.hideKeyboardHelper();
    await this.contactSelectorPage.recipientContact(invitee).click();
    await this.contactSelectorPage.shareButton.click();
});

Then('I can see the {string} folder in my files', async function(folderName) {
    const folderVisible = await this.filesListPage.folderNamedVisible(folderName);
    folderVisible.should.be.true; // eslint-disable-line
});
