import { observable } from 'mobx';
import SpotBeacon from './spot-beacon';
import routes from '../routes/routes';

class TabBeacons {
    get chatBeacon() {
        const condition = () => routes.main.inactive;
        return observable({
            id: 'mobile-chat-icon',
            priority: 5,
            flow: 'onboarding',
            component: SpotBeacon,
            headerText: 'title_chat_beacon',
            descriptionText: 'description_chat_beacon',
            condition,
            position: null
        });
    }

    get filesBeacon() {
        const condition = () => routes.main.inactive;
        return observable({
            id: 'mobile-files-icon',
            priority: 3,
            flow: 'onboarding',
            component: SpotBeacon,
            headerText: 'title_files_beacon',
            descriptionText: 'description_files_beacon',
            position: null,
            condition
        });
    }

    get contactBeacon() {
        const condition = () => routes.main.inactive;
        return observable({
            id: 'mobile-contact-icon',
            priority: 1,
            flow: 'onboarding',
            component: SpotBeacon,
            headerText: 'title_contact_beacon',
            descriptionText: 'description_contact_beacon',
            position: null,
            condition
        });
    }
}

const tabBeacons = new TabBeacons();

// TODO: remove before merging
global.tabBeacons = tabBeacons;

module.exports = tabBeacons;
