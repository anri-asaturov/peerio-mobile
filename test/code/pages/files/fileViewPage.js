const Page = require('../page');

class FileViewPage extends Page {
    get fileOpenButton() {
        return this.getWhenEnabled(`~button-open`);
    }
}

module.exports = FileViewPage;
