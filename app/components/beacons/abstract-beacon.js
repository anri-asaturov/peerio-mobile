import { action, observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { LayoutAnimation } from 'react-native';
import SafeComponent from '../shared/safe-component';
import beaconState from './beacon-state';

@observer
export default class AbstractBeacon extends SafeComponent {
    @observable descriptionTextHeight;
    // to understand if user follows the beacon flow or not
    wasPressed = false;

    componentWillMount() {
        LayoutAnimation.easeInEaseOut();
    }

    componentWillUnmount() {
        const { onUnmount } = this.props;
        onUnmount && onUnmount(this.wasPressed);
    }

    @action.bound onPress() {
        const { id } = this.props;
        beaconState.removeBeacon(id);
        beaconState.markSeen([id]);
    }

    @action.bound onPressContainer() {
        // pressing container should break the flow of beacons
        // if we have one. to handle that we use onDismiss
        const { onDismiss, id } = this.props;
        if (onDismiss) {
            // we are not calling onDismiss to not
            // spam saving beacon requests
            beaconState.removeBeacon(id);
            onDismiss();
        } else {
            this.onPress();
        }
    }

    @action.bound onPressIcon() {
        this.wasPressed = true;
        this.onPress();
        this.props.onPressIcon();
    }
}
