import { observable } from 'mobx';
import SpotBeacon from './spot-beacon';
import routes from '../routes/routes';
import beaconState from './beacon-state';
import uiState from '../layout/ui-state';

const chatBeacon = createOnboardingBeacon({
    id: 'chat',
    condition: () => uiState.isFirstLogin && routes.main.inactive,
    priority: 5,
    component: SpotBeacon,
    headerText: 'title_chat_beacon',
    descriptionText: 'description_chat_beacon'
});

const filesBeacon = createOnboardingBeacon({
    id: 'files',
    condition: () => uiState.isFirstLogin && routes.main.inactive,
    priority: 3,
    component: SpotBeacon,
    headerText: 'title_files_beacon',
    descriptionText: 'description_files_beacon'
});

const contactBeacon = createOnboardingBeacon({
    id: 'contact',
    condition: () => uiState.isFirstLogin && routes.main.inactive,
    priority: 1,
    component: SpotBeacon,
    headerText: 'title_contact_beacon',
    descriptionText: 'description_contact_beacon'
});

const onboardingBeacons = {
    chatBeacon,
    filesBeacon,
    contactBeacon
};

global.onboardingBeacons = onboardingBeacons;

function dismissAllOnboardingBeacons() {
    // mark all onboarding flow as seen
    beaconState.markSeen(Object.keys(onboardingBeacons).map(b => onboardingBeacons[b].id));
}

function createOnboardingBeacon(props) {
    return observable({
        ...props,
        position: null,
        onDismiss: dismissAllOnboardingBeacons,
        onUnmount(wasPressed) {
            if (!wasPressed) dismissAllOnboardingBeacons();
        }
    });
}

export { onboardingBeacons, dismissAllOnboardingBeacons };
