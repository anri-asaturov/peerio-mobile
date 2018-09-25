import { observable } from 'mobx';
import AreaBeacon from '../../beacons/area-beacon';
import SpotBeacon from '../../beacons/spot-beacon';
import routes from '../../routes/routes';
import uiState from '../../layout/ui-state';

class MockTabBeacons {
    get chatBeacon() {
        const condition = () => routes.main.route === 'chats';
        return observable({
            id: 'mobile-chat-icon',
            component: uiState.mockBeaconType ? AreaBeacon : SpotBeacon,
            sidePointer: !uiState.mockBeaconArrowDirection,
            headerText: 'title_contacts',
            descriptionText: 'description_startChat_beacon',
            condition,
            position: null
        });
    }

    get filesBeacon() {
        const condition = () => routes.main.route === 'files';
        return observable({
            id: 'mobile-files-icon',
            component: uiState.mockBeaconType ? AreaBeacon : SpotBeacon,
            sidePointer: !uiState.mockBeaconArrowDirection,
            headerText: 'title_contacts',
            descriptionText: 'title_findContacts',
            position: null,
            condition
        });
    }

    get contactBeacon() {
        const condition = () => routes.main.route.toLowerCase().includes('contact');
        return observable({
            id: 'mobile-contact-icon',
            component: uiState.mockBeaconType ? AreaBeacon : SpotBeacon,
            sidePointer: !uiState.mockBeaconArrowDirection,
            headerText: 'title_contacts',
            descriptionText: 'title_findContacts',
            position: null,
            condition
        });
    }

    get settingsBeacon() {
        const condition = () => routes.main.route === 'settings';
        return observable({
            id: 'mobile-settings-icon',
            component: uiState.mockBeaconType ? AreaBeacon : SpotBeacon,
            sidePointer: !uiState.mockBeaconArrowDirection,
            headerText: 'title_contacts',
            descriptionText: 'title_findContacts',
            position: null,
            condition
        });
    }
}

const mockTabBeacons = new MockTabBeacons();

// TODO: remove before merging
global.mockTabBeacons = mockTabBeacons;

module.exports = mockTabBeacons;
