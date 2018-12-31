import randomWords from 'random-words';
import capitalize from 'capitalize';

let counter = 0;

class MockContact {
    constructor() {
        const username = `${randomWords()}${counter++}`;
        const firstName = capitalize(randomWords());
        const lastName = capitalize(randomWords());
        const address = `${randomWords()}@123com`;
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

export default MockContact;
