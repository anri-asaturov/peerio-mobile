import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import beaconState from '../beacons/beacon-state';
import SafeComponent from './safe-component';
import { contactState } from '../states';
import MeasureableView from './measureable-view';
import BlueRoundButton from '../buttons/blue-round-button';

@observer
export default class SyncContactsButton extends SafeComponent {
    onMeasure = position => {
        const { beacon } = this.props;
        if (!beacon) return;
        // console.log(JSON.stringify(position));
        beacon.position = position;
        beaconState.requestBeacon(beacon);
    };

    componentWillUnmount() {
        const { beacon } = this.props;
        if (beacon) beaconState.removeBeacon(beacon.id);
    }

    renderThrow() {
        const width = 247;
        return (
            <View style={{ alignItems: 'center' }}>
                <MeasureableView onMeasure={this.onMeasure}>
                    <BlueRoundButton
                        text="button_syncContacts"
                        onPress={contactState.syncContacts}
                        style={{ width }}
                        extraTextStyle={{ height: undefined }}
                    />
                </MeasureableView>
            </View>
        );
    }
}
