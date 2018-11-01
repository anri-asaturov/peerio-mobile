import { observable } from 'mobx';
import MockChannel from './mock-channel';
import mockContactStore from './mock-contact-store';

class MockChat extends MockChannel {
    @observable isChannel = false;
    otherParticipants = [];

    initParticipants() {
        // exactly one participant
        this.participants.push(mockContactStore.createMock());
    }
}

export default MockChat;
