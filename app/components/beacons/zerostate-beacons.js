import { observable } from 'mobx';
import SpotBeacon from './spot-beacon';
import AreaBeacon from './area-beacon';
import routes from '../routes/routes';
import { chatStore, fileStore, contactStore } from '../../lib/peerio-icebear';
import beaconState from './beacon-state';
import preferenceStore from '../settings/preference-store';

const startChatBeacon = createZeroStateBeacon({
    id: 'startChat',
    condition: () => {
        const firstLoginChat = routes.main.route === 'chats';
        const noChatsCreated = chatStore.chats.length === 0;
        return firstLoginChat && noChatsCreated;
    },
    priority: 6,
    component: SpotBeacon,
    headerText: 'title_startChat_beacon',
    descriptionText: 'description_startChat_beacon',
    position: null
});

const uploadFileBeacon = createZeroStateBeacon({
    id: 'uploadFiles',
    condition: () => {
        const firstLoginFiles = routes.main.route.toLowerCase().includes('file');
        const noFilesUploaded = fileStore.files.length === 0;

        return firstLoginFiles && noFilesUploaded;
    },
    priority: 4,
    component: SpotBeacon,
    headerText: 'title_uploadFiles_beacon',
    descriptionText: 'description_uploadFiles_beacon',
    position: null
});

const addContactBeacon = createZeroStateBeacon({
    id: 'search',
    condition: () => {
        const firstLoginContacts = routes.main.route.toLowerCase().includes('contact');
        const noAddedContacts = contactStore.contacts.length === 0;

        return (
            !preferenceStore.prefs.importContactsInBackground &&
            firstLoginContacts &&
            noAddedContacts
        );
    },
    priority: 2,
    component: SpotBeacon,
    headerText: 'title_search_beacon',
    descriptionText: 'description_search_beacon'
});

const syncBeacon = createZeroStateBeacon({
    id: 'sync',
    condition: () => !preferenceStore.prefs.importContactsInBackground,
    priority: 0,
    component: AreaBeacon,
    descriptionText: 'description_sync_beacon'
});

const zeroStateBeacons = {
    startChatBeacon,
    uploadFileBeacon,
    addContactBeacon,
    syncBeacon
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
