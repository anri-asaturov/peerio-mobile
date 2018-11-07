import { observable, computed } from 'mobx';
import randomWords from 'random-words';
import mockContactStore from './mock-contact-store';
import { popupCancelConfirm } from '../shared/popups';
import MockChannel from './mock-channel';
import MockChat from './mock-chat';

const channelPaywallTitle = `2 Channels`;
const channelPaywallMessage =
`Peerio's basic account gets you access to 2 free channels.
If you would like to join or create another channel, please delete an existing one or check out our upgrade plans`;

class MockChatStore {
    @observable chats = [];
    @observable invites = [];
    @observable loaded = true;
    @computed get channels() {
        return this.chats.filter(chat => chat.isChannel);
    }

    get allRooms() { return this.channels; }

    constructor() {
        for (let i = 0; i < 15; ++i) {
            this.chats.push(this.createMockChannel());
        }

        for (let i = 0; i < 125; ++i) {
            this.chats.push(this.createMock());
        }

        for (let i = 0; i < 4; ++i) {
            this.invites.push(this.createInvite());
        }

        this.activeChat = this.chats[0];
    }

    createMock() {
        return new MockChat();
    }

    createMockChannel() {
        return new MockChannel();
    }

    createInvite() {
        const invite = observable({
            id: randomWords({ min: 7, max: 7, join: ':' }),
            title: randomWords({ min: 1, max: 3, join: '-' }),
            invitedBy: mockContactStore.createMock()
        });

        invite.acceptInvite = () => {
            popupCancelConfirm(channelPaywallTitle, channelPaywallMessage);
        };

        invite.rejectInvite = () => {
            this.invites.splice(this.invites.indexOf(invite), 1);
        };

        return invite;
    }

    loadAllChats() {
    }
}

export default new MockChatStore();
