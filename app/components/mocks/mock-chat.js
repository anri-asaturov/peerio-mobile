import { observable } from 'mobx';
import MockChannel from './mock-channel';

class MockChat extends MockChannel {
    @observable isChannel = false;
}

export default MockChat;
