const Page = require('../page');

class roomCreationPage extends Page {
    get textInputRoomName() {
        return this.getWhenVisible(`~textInput-channelName`);
    }

    get nextButton() {
        return this.getWhenVisible(`~buttonNext`);
    }

    get textInputContactSearch() {
        return this.getWhenVisible(`~textInputContactSearch`);
    }

    get goButton() {
        return this.getElementInContainer('~chooseContacts', '~buttonGo');
    }

    recipientContact(contact) {
        return this.getElementInContainer('~foundContacts', `~${contact}`);
    }
}

module.exports = roomCreationPage;
