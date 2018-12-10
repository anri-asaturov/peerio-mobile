import { observable } from 'mobx';

class MockCurrentUser {
    @observable firstName;
    @observable lastName;
    @observable username;
    beacons = observable.map();
    activePlans = [];
    settings = {
        loaded: true
    };
    loading = false;

    saveBeacons() {
        console.log(`mock save beacons`);
    }

    constructor() {
        const username = `mockCurrentUser`;
        const firstName = 'Current';
        const lastName = 'User';
        const address = `current@user.com`;
        Object.assign(this, {
            username,
            firstName,
            lastName,
            addresses: [address],
            loading: false,
            notFound: false,
            fullName: `${firstName} ${lastName}`
        });
    }
}

export default MockCurrentUser;
