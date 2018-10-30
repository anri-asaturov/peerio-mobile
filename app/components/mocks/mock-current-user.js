import randomWords from 'random-words';
import capitalize from 'capitalize';
import { observable } from 'mobx';

class MockCurrentUser {
    @observable firstName;
    @observable lastName;
    @observable username;
    beacons = observable.map();
    activePlans = [];

    saveBeacons() {
        console.log(`mock save beacons`);
    }

    constructor() {
        const username = `${randomWords()}${this.contacts.length}`;
        const firstName = capitalize(randomWords());
        const lastName = capitalize(randomWords());
        const address = `${randomWords()}@123.com`;
        Object.assign(this, {
            username,
            firstName,
            lastName,
            addresses: [
                address
            ],
            loading: false,
            notFound: false,
            fullName: `${firstName} ${lastName}`
        });
    }
}

export default MockCurrentUser;
