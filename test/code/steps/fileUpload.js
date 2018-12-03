const { Then } = require('cucumber');

Then('I upload a file from gallery to Files', async function() {
    await this.homePage.filesTab.click();
    // dismiss all beacons (files.js:testAction2)
    await this.filesListPage.testAction2();
    await this.filesListPage.uploadFileButtton.click();
    await this.fileUploadPage.uploadFileFromGallery();
    // TOOD: do an actual check
    await this.app.pause(3000);
});

Then('I upload a file from gallery to the current Chat', async function() {
    await this.chatPage.buttonUploadToChat.click();
    await this.fileUploadPage.uploadFileFromGallery();
    await this.filesListPage.fileSharePreviewPopup.click();
});

Then('I can download the last uploaded file from Files', async function() {
    await this.homePage.filesTab.click();
    // uses files.js:testAction1 helper to navigate to the topmost uploaded file
    // hint: this doesn't make sense for the pre-existing user
    await this.filesListPage.testAction1();
    await this.app.pause(1000);
    // freshly downloaded file is pre-cached
    await this.fileViewPage.fileOpenButton.click();

    /* if (this.context.platform.desiredCapabilities.platformName === 'Android') {
        await this.fileViewPage.encryptionRecommendationPopup.click();
        await this.fileViewPage.filesDecryptedPopup.click();
    } */
});
