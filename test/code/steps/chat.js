const { existingUsers } = require('../helpers/userHelper');

const { When, Then } = require('cucumber');

When('I start a DM with {word} user', async function(string) {
    const user = string === 'helper' ? this.helperUsername : existingUsers[string].name;
    await this.openContactsPickerForDM();
    await this.searchForRecipient(user);
    await this.contactSelectorPage.recipientContact(user).click();
});

When('I create a new room', async function() {
    await this.listener.request(`beaconState.dismissAll()`);
    this.roomName = new Date().getTime();
    await this.chatListPage.buttonCreateNewChat.click();
    await this.chatActionSheetPage.newRoomOption.click();
    await this.roomCreationPage.textInputRoomName.setValue(this.roomName);
    await this.roomCreationPage.hideKeyboardHelper();
    await this.roomCreationPage.nextButton.click();
    await this.roomCreationPage.goButton.click();
});

When('I create a new room named {word}', async function(string) {
    await this.listener.request(`beaconState.dismissAll()`);
    this.roomName = string;
    await this.chatListPage.buttonCreateNewChat.click();
    await this.chatActionSheetPage.newRoomOption.click();
    await this.roomCreationPage.textInputRoomName.setValue(this.roomName);
    await this.roomCreationPage.hideKeyboardHelper();
    await this.roomCreationPage.nextButton.click();
    await this.roomCreationPage.goButton.click();
});

When('I exit the current chat', async function() {
    await this.chatPage.buttonExitChat.click();
});

Then('I can send a message to the current chat', async function() {
    const message = `Test message ${new Date().getTime()}`;
    await this.chatPage.textInput.setValue(message);
    await this.chatPage.hideKeyboardHelper();
    await this.chatPage.buttonSendMessage.click();
});

Then('I send several messages to the current chat', async function() {
    if (await this.chatPage.shareFileInChatBeaconVisible)
        await this.chatPage.shareFileInChatBeacon.click();

    for (let i = 0; i < 3; i++) {
        // trying to fill the screen with messages
        const message = `Test message ${new Date().getTime()}\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n--`;
        await this.chatPage.textInput.setValue(message);
        await this.chatPage.hideKeyboardHelper();
        await this.chatPage.buttonSendMessage.click();
    }
});

Then('I scroll down the chat list', async function() {
    await this.chatListPage.scrollDownHelper();
});

Then('I press the top unread message indicator', async function() {
    await this.chatListPage.topUnreadMessageIndicator.click();
});

Then('I can see the top unread chat', async function() {
    await this.chatListPage.chatWithTitle(this.roomName);
});

Then('I press the bottom unread message indicator', async function() {
    try {
        await this.chatListPage.snackbar.click();
    } catch (e) {
        console.log('"I press the bottom unread message indicator" Step: snackbar was not found');
    }
    await this.chatListPage.bottomUnreadMessageIndicator.click();
});

Then('I can see the bottom unread chat', async function() {
    await this.chatListPage.chatWithTitle(this.roomName);
});

Then('I can open a chat with {word}', async function(string) {
    await this.chatListPage.chatWithTitle(string).click();
});

Then('I open the chat', async function() {
    await this.chatListPage.chatWithTitle(this.username).click();
});

Then('I scroll up the chat', async function() {
    await this.app.pause(5000); // wait till chat loads
    if (await this.chatPage.shareFileInChatBeaconVisible)
        await this.chatPage.shareFileInChatBeacon.click();
    await this.chatPage.testAction2();
});

Then('I click the chat unread message indicator', async function() {
    await this.chatPage.chatUnreadMessageIndicator.click();
});

Then('I can no longer see the unread message indicator', async function() {
    await this.chatPage.chatUnreadMessageIndicatorDisappeared;
});

Then('They can send a message to the current chat', async function() {
    const message = `Test Message ${new Date().getTime()}`;
    await this.chatPage.textInput.setValue(message);
    await this.chatPage.hideKeyboardHelper();
    await this.chatPage.buttonSendMessage.click();
});

Then('I receive placeholder DM', async function() {
    console.log(`I am ${this.username}, trying to find ${this.helperUsername}`);
    await this.chatListPage.chatWithTitle(this.helperUsername).click();
});

Then('They receive placeholder DM', async function() {
    await this.chatListPage.chatWithTitle(this.username).click();
});

Then('I cannot see their DM', async function() {
    const dmDisappeared = await this.chatListPage.chatWithTitleDisappeared(this.username);
    dmDisappeared.should.be.true; // eslint-disable-line
});

Then('They cannot see my DM', async function() {
    const dmDisappeared = await this.chatListPage.chatWithTitleDisappeared(this.username);
    dmDisappeared.should.be.true; // eslint-disable-line
});

Then('User accepts placeholder DM', async function() {
    await this.chatPage.messageDmPlaceholder.click();
});

Then('User dismisses placeholder DM', async function() {
    await this.chatPage.dismissDmPlaceholder.click();
});

Then(/(?:I am|they are) in the chat list page/, async function() {
    await this.chatListPage.buttonCreateNewChat;
});

Then('I fill my chatlist', async function() {
    await this.chatListPage.testAction2();
});

Then('A chat opens with the support user', async function() {
    await this.chatPage.textInput;
});
