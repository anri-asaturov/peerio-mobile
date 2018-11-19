const Page = require('../page');

class ProfilePage extends Page {
    get fullName() {
        return this.getWhenVisible('~fullName');
    }

    get firstName() {
        return this.getWhenVisible('~inputFirstName');
    }

    get lastName() {
        return this.getWhenVisible('~inputLastName');
    }

    get uploadAvatarIcon() {
        return this.getWhenVisible('~uploadAvatarIcon');
    }

    get currentAvatar() {
        return this.getWhenVisible('~currentAvatar');
    }

    get avatarLetterDisappeared() {
        return this.app.waitForVisible('~avatarLetter', 5000, true);
    }
}

module.exports = ProfilePage;
