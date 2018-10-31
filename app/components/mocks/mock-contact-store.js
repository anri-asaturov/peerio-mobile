import randomWords from 'random-words';
import capitalize from 'capitalize';
import { observable } from 'mobx';
import MockCurrentUser from './mock-current-user';

class MockContactStore {
    addedContacts = [];
    invitedContacts = [];
    invitedNotJoinedContacts = [];
    contacts = [];
    contactsMap = observable.map();

    constructor() {
        for (let i = 0; i < 15; ++i) {
            this.createMock();
        }
    }

    get uiView() {
        return [{
            letter: 'A',
            items: this.contacts
        }];
    }

    filter = (text) => {
        return text ? this.contacts.filter(c => c.username.indexOf(text) !== -1) : this.contacts;
    };

    createMock() {
        const username = `${randomWords()}${this.contacts.length}`;
        const firstName = capitalize(randomWords());
        const lastName = capitalize(randomWords());
        const address = `${randomWords()}@123com`;
        const contact = {
            username,
            firstName,
            lastName,
            addresses: [
                address
            ],
            loading: false,
            notFound: false,
            fullName: `${firstName} ${lastName}`
        };
        this.contacts.push(contact);
        this.contactsMap.set(username, contact);
        return contact;
    }

    createMockCurrentUser() {
        const contact = new MockCurrentUser();
        this.contacts.push(contact);
        this.contactsMap.set(contact.username, contact);
        return contact;
    }

    getContact(username) {
        const r = this.contactsMap.get(username);
        return r || { username, loading: false, notFound: true };
    }
}

export default new MockContactStore();
