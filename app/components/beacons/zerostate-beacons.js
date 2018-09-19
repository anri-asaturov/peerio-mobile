import { observable } from 'mobx';
import SpotBeacon from './spot-beacon';
import routes from '../routes/routes';
import uiState from '../layout/ui-state';
import { chatStore, fileStore, contactStore } from '../../lib/peerio-icebear';
import beaconState from './beacon-state';

const startChatBeacon = createZeroStateBeacon({
    id: 'mobile-start-dm',
    condition: () => {
        const { inactive } = routes.main;
        const firstLoginChat = uiState.isFirstLogin && routes.main.route === 'chats';
        const noChatsCreated = chatStore.chats.length === 0;
        return inactive && (firstLoginChat || noChatsCreated);
    },
    priority: 6,
    component: SpotBeacon,
    headerText: 'title_startChat_beacon',
    descriptionText: 'description_startChat_beacon',
    position: null
});

const uploadFileBeacon = createZeroStateBeacon({
    id: 'mobile-upload-file',
    condition: () => {
        const firstLoginFiles = uiState.isFirstLogin && routes.main.route.toLowerCase().includes('file');
        const noFilesUploaded = fileStore.files.length === 0;

        return firstLoginFiles || noFilesUploaded;
    },
    priority: 4,
    component: SpotBeacon,
    headerText: 'title_uploadFiles_beacon',
    descriptionText: 'description_uploadFiles_beacon',
    position: null
});

const addContactBeacon = createZeroStateBeacon({
    id: 'mobile-addContact',
    condition: () => {
        const firstLoginContacts = uiState.isFirstLogin && routes.main.route.toLowerCase().includes('contact');
        const noAddedContacts = contactStore.contacts.length === 0;

        return firstLoginContacts || noAddedContacts;
    },
    priority: 2,
    component: SpotBeacon,
    headerText: 'title_search_beacon',
    descriptionText: 'description_search_beacon'
});

const zeroStateBeacons = {
    startChatBeacon,
    uploadFileBeacon,
    addContactBeacon
};

global.zeroStateBeacons = zeroStateBeacons;

function createZeroStateBeacon(props) {
    return observable({
        ...props,
        position: null,
        onUnmount() {
            beaconState.markSeen([props.id]);
        }
    });
}

module.exports = zeroStateBeacons;
