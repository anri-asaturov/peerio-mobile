import { observable } from 'mobx';
import SpotBeacon from './spot-beacon';
import routes from '../routes/routes';
import uiState from '../layout/ui-state';
import beaconState from './beacon-state';
import { chatStore, fileStore, contactStore } from '../../lib/peerio-icebear';

const startChatBeacon = createOnboardingBeacon({
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

const uploadFileBeacon = createOnboardingBeacon({
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

const addContactBeacon = createOnboardingBeacon({
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

const chatBeacon = createOnboardingBeacon({
    id: 'mobile-chat-icon',
    condition: () => routes.main.inactive,
    priority: 5,
    flow: 'onboarding',
    component: SpotBeacon,
    headerText: 'title_chat_beacon',
    descriptionText: 'description_chat_beacon'
});

const filesBeacon = createOnboardingBeacon({
    id: 'mobile-files-icon',
    condition: () => routes.main.inactive,
    priority: 3,
    flow: 'onboarding',
    component: SpotBeacon,
    headerText: 'title_files_beacon',
    descriptionText: 'description_files_beacon'
});

const contactBeacon = createOnboardingBeacon({
    id: 'mobile-contact-icon',
    condition: () => routes.main.inactive,
    priority: 1,
    flow: 'onboarding',
    component: SpotBeacon,
    headerText: 'title_contact_beacon',
    descriptionText: 'description_contact_beacon'
});

const onboardingBeacons = {
    startChatBeacon,
    uploadFileBeacon,
    addContactBeacon,
    chatBeacon,
    filesBeacon,
    contactBeacon
};

global.onboardingBeacons = onboardingBeacons;

function createOnboardingBeacon(props) {
    return observable({
        ...props,
        position: null,
        onDismiss() {
            // mark all onboarding flow as seen
            beaconState.markSeen(
                Object.keys(onboardingBeacons).map(b => onboardingBeacons[b].id)
            );
        }
    });
}

module.exports = onboardingBeacons;
