const { defineSupportCode } = require('cucumber');
const { existingUsers } = require('../helpers/userHelper');

defineSupportCode(({ When, Then }) => {
    When('I invite {word} to join the room', async function (string) {
        let invitee;
        if (string === 'someone') invitee = process.env.CHAT_RECIPIENT_USER;
        else if (string === 'them') invitee = this.username;
        else invitee = existingUsers[string].name;

        await this.scrollToChat();
        await this.chatListPage.chatWithTitle(this.roomName).click();

        await this.app.pause(1000); // clicks on the same element twice if no pause
        await this.chatPage.chatWithTitle(this.roomName).click();
        await this.chatPage.addMembersButton.click();

        await this.contactSelectorPage.textInput.setValue(invitee);
        await this.contactSelectorPage.hideKeyboardHelper();
        await this.contactSelectorPage.recipientContact(invitee).click();

        await this.chatPage.buttonExitChat.click();
    });

    Then('they log in', async function () {
        if (this.username && this.passphrase) await this.loginExistingAccountWithout2FA(this.username, this.passphrase);
        else console.log('they log in: username and/or passphrase does not exist.');
    });

    Then('they accept the room invite', async function () {
        await this.chatListPage.chatWithTitle(this.roomName).click();

        await this.roomInvitePage.acceptButton.click();

        await this.chatPage.buttonSendMessage;
    });

    Then('they decline the room invite', async function () {
        await this.scrollToChat();
        await this.chatListPage.chatWithTitle(this.roomName).click();

        await this.roomInvitePage.declineButton.click();
    });

    When('I cancel the invite', async function () {
        await this.scrollToChat();
        await this.chatListPage.chatWithTitle(this.roomName).click();

        await this.app.pause(5000); // android needs a pause
        await this.chatPage.chatWithTitle(this.roomName).click();
        // uses testAction1 in member-list.js
        await this.chatPage.testAction1();

        const invitedContactRemoved = await this.chatPage.invitedContactRemoved;
        invitedContactRemoved.should.be.true; // eslint-disable-line

        try {
            await this.chatPage.buttonCloseModal.click(); // exit room info list
            await this.chatPage.buttonExitChat.click(); // exit chat
        } catch (e) {
            console.error(e);
            await this.app.pause(500000);
        }
    });

    Then('they do not have any room invites', async function () {
        const roomExists = await this.chatListPage.chatWithTitleExists(this.roomName);
        roomExists.should.be.false; // eslint-disable-line
    });

    Then('they leave the room', async function () {
        await this.chatPage.chatWithTitle(this.roomName).click();
        await this.app.pause(1000);
        await this.chatPage.leaveRoomButton.click();
        await this.chatPage.confirmLeaveRoomButton.click();
    });

    Then('they sign out', async function () {
        await this.logout();
    });
});
