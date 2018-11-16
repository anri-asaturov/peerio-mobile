const Page = require('../page');

class FilesListPage extends Page {
    get placeholder() {
        return this.getWhenVisible('~files-zero-state-illustration');
    }

    get buttonBack() {
        return this.getWhenVisible('~buttonBackIcon');
    }

    get buttonBackPresent() {
        return this.checkIfPresent('~buttonBackIcon');
    }

    fileNamed(selector) {
        return this.getWhenVisible(`~${selector}`);
    }

    folderNamed(selector) {
        return this.getWhenVisible(`~${selector}`);
    }

    get createFolderOption() {
        return this.getWhenVisible('~Create a folder');
    }

    get deleteOption() {
        return this.getWhenVisible('~Delete');
    }

    get moveOption() {
        return this.getWhenVisible('~Move');
    }

    get confirmDelete() {
        return this.getWhenVisible('~button-confirm');
    }

    get folderNameInput() {
        return this.getWhenVisible('~Enter a folder name');
    }

    get fileNameInput() {
        return this.getWhenVisible('~title_name');
    }

    get fileUploadedPopup() {
        return this.getWhenVisible(`~button-ok`);
    }

    get acceptFolderName() {
        return this.getWhenVisible(`~button-ok`);
    }

    get fileSharePreviewPopup() {
        return this.getWhenVisible(`~button-share`);
    }

    get uploadFileButtton() {
        return this.getWhenVisible('~buttonUploadFileToFiles');
    }

    get optionsButtton() {
        return this.getWhenVisible('~more-vert');
    }

    optionsButttonFor(selector) {
        return this.getElementInContainer(`~${selector}`, '~more-vert');
    }
}

module.exports = FilesListPage;
