import { observable } from 'mobx';
import SpotBeacon from './spot-beacon';
import routes from '../routes/routes';
import { chatStore } from '../../lib/peerio-icebear';
import beaconState from './beacon-state';
import AreaBeacon from './area-beacon';
import uiState from '../layout/ui-state';

const shareFilesInChatBeacon = createBeacon({
    id: 'shareFileInChat',
    condition: () => {
        const inChatView = routes.main.route === 'chats';
        const firstChat = !uiState.isFirstLogin && chatStore.chats.length === 1;
        const firstFiveMessagesSent = uiState.isFirstLogin && chatStore.chats.length === 1 && chatStore.chats[0].messages.length > 5;
        return inChatView && (firstChat || firstFiveMessagesSent);
    },
    priority: 6,
    component: SpotBeacon,
    headerText: 'title_shareInChat_beacon',
    descriptionText: 'description_shareInChat_beacon_mobile',
    position: null
});

const infoPanelBeacon = createBeacon({
    id: 'chatInfoPanel',
    condition: () => {
        const inChatView = routes.main.route === 'chats';
        const recentFilesSent = chatStore.chats[0] && chatStore.chats.some(c => c.recentFiles.length > 0);
        return uiState.isFirstLogin && inChatView && recentFilesSent;
    },
    priority: 7,
    component: AreaBeacon,
    descriptionText: 'description_infoPanel_beacon_mobile',
    position: null
});

const pinDmBeacon = createBeacon({
    id: 'pinDm',
    condition: () => {
        return routes.main.route === 'chats'; // 'chatInfo'
    },
    overModal: true,
    priority: 8,
    component: SpotBeacon,
    descriptionText: 'description_pin_beacon'
});

const chatBeacons = {
    shareFilesInChatBeacon,
    infoPanelBeacon,
    pinDmBeacon
};


function createBeacon(props) {
    return observable({
        ...props,
        position: null,
        onUnmount() {
            beaconState.markSeen([props.id]);
        }
    });
}

module.exports = chatBeacons;
