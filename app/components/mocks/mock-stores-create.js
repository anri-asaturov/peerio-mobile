import MockContactStore from './mock-contact-store';
import MockChatStore from './mock-chat-store';
import MockFileStore from './mock-file-store';
import chatState from '../messaging/chat-state';
import contactState from '../contacts/contact-state';
import fileState from '../files/file-state';
import { User } from '../../lib/icebear';

function mockStoresCreate() {
    // contact store has a priority to be created
    // because it is used by other stores
    const mockContactStore = new MockContactStore();
    User.current = mockContactStore.createMockCurrentUser();
    contactState.store = mockContactStore;
    contactState.init();

    const mockFileStore = new MockFileStore();
    fileState.store = mockFileStore;

    const mockChatStore = new MockChatStore();
    chatState.store = mockChatStore;
    chatState.init();
}

export default mockStoresCreate;
