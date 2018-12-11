const Page = require('../page');

class ContactSelectorPage extends Page {
    recipientContact(contact) {
        return this.getElementInContainer('~foundContacts', `~${contact}`);
    }

    get textInput() {
        return this.getWhenVisible('~textInputContactSearch');
    }

    get firstContact() {
        return this.getElementInContainer('~0', `~${process.env.CHAT_RECIPIENT_USER}`);
    }

    get notFirstContact() {
        return this.checkElementInContainer('~0', `~${process.env.CHAT_RECIPIENT_USER}`);
    }

    get closeButton() {
        return this.getWhenVisible('~closeButton');
    }

    get shareButton() {
        return this.getWhenVisible('~share');
    }
}

module.exports = ContactSelectorPage;
