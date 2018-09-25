const { defineSupportCode } = require('cucumber');

defineSupportCode(({ Then }) => {
    Then('the Files tab is empty', async function () {
        await this.homePage.filesTab.click();
        await this.filesListPage.placeholder;
    });

    Then('I create a folder named {string}', async function (word) {
        await this.filesListPage.uploadFileButtton.click();

        await this.filesListPage.createFolderOption.click();
        await this.filesListPage.folderNameInput.setValue(word);
        await this.filesListPage.hideKeyboardHelper();
        await this.filesListPage.acceptFolderName.click();
    });

    Then('I open the {string} folder', async function (word) {
        await this.filesListPage.folderNamed(word).click();
    });

    Then('I upload a file', async function () {
        await this.filesListPage.uploadFileButtton.click();
        await this.fileUploadPage.uploadFileFromGallery();
        await this.filesListPage.fileNameInput.setValue('Iceland');
        await this.filesListPage.hideKeyboardHelper();
        await this.filesListPage.fileUploadedPopup.click();
    });

    Then('I delete the folder named {string}', async function (word) {
        await this.homePage.filesTab.click();
        await this.filesListPage.optionsButttonFor(word).click();
        await this.filesListPage.deleteOption.click();
        await this.filesListPage.confirmDelete.click();
    });

    Then('I move the file in the folder named {string}', async function (word) {
        await this.homePage.filesTab.click();

        await this.filesListPage.optionsButttonFor('Iceland.jpg').click();
        await this.filesListPage.moveOption.click();

        await this.filesListPage.folderNamed(word).click();
    });

    Then('the file is present', async function () {
        await this.filesListPage.folderNamed('Iceland.jpg');
    });

    Then('the {string} folder is present', async function (word) {
        await this.filesListPage.folderNamed(word);
    });

    Then('I move the {string} folder in the {string} folder', async function (toMove, parent) {
        await this.filesListPage.optionsButttonFor(toMove).click();
        await this.filesListPage.moveOption.click();
        await this.filesListPage.folderNamed(parent).click();
    });
});
