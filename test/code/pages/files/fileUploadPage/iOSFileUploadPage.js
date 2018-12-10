const Page = require('../../page');

class iOSFileUploadPage extends Page {
    async uploadFromGallery() {
        await this.getWhenVisible('~Upload from gallery').click();

        try {
            console.log(`Waiting for gallery permission`);
            await this.getWhenVisible('~OK', 2000).click();
        } catch (e) {
            console.log(`No gallery permission needed`);
            // no permissions alert present
        }
    }

    async uploadFileFromGallery() {
        await this.uploadFromGallery();
        await this.getWhenVisible('~Moments').click();
        // selects the third photo in the list
        await this.getWhenVisible(`//XCUIElementTypeCell[2]`).click();
    }

    async uploadCropImageFromCamera() {
        await this.uploadFromGallery();
        await this.getWhenVisible('~Camera Roll').click();
        await this.waitToDisappear('~Camera Roll');
        await this.pressCoords(100, 100);
        await this.getWhenVisible('~Choose').click();
    }
}

module.exports = iOSFileUploadPage;
