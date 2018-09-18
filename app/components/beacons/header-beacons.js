import { observable } from 'mobx';
import SpotBeacon from './spot-beacon';
import routes from '../routes/routes';
import uiState from '../layout/ui-state';
import chatStore from '../../lib/peerio-icebear/models/chats/chat-store';
import fileStore from '../../lib/peerio-icebear/models/files/file-store';
import contactStore from '../../lib/peerio-icebear/models/contacts/contact-store';

class HeaderBeacons {
    get startChatBeacon() {
        const condition = () => {
            const { inactive } = routes.main;
            const firstLoginChat = uiState.isFirstLogin && routes.main.route === 'chats';
            const noChatsCreated = chatStore.chats.length === 0;

            return inactive && (firstLoginChat || noChatsCreated);
        };
        return observable({
            id: 'mobile-start-dm',
            priority: 6,
            component: SpotBeacon,
            headerText: 'title_startChat_beacon',
            descriptionText: 'description_startChat_beacon',
            position: null,
            condition
        });
    }

    get uploadFileBeacon() {
        const condition = () => {
            const firstLoginFiles = uiState.isFirstLogin && routes.main.route.toLowerCase().includes('file');
            const noFilesUploaded = fileStore.files.length === 0;

            return firstLoginFiles || noFilesUploaded;
        };
        return observable({
            id: 'mobile-upload-file',
            priority: 4,
            component: SpotBeacon,
            headerText: 'title_uploadFiles_beacon',
            descriptionText: 'description_uploadFiles_beacon',
            position: null,
            condition
        });
    }

    get addContactBeacon() {
        const condition = () => {
            const firstLoginContacts = uiState.isFirstLogin && routes.main.route.toLowerCase().includes('contact');
            const noAddedContacts = contactStore.contacts.length === 0;

            return firstLoginContacts || noAddedContacts;
        };
        return observable({
            id: 'mobile-addContact',
            priority: 2,
            component: SpotBeacon,
            headerText: 'title_search_beacon',
            descriptionText: 'description_search_beacon',
            position: null,
            condition
        });
    }
}

const headerBeacons = new HeaderBeacons();

module.exports = headerBeacons;
