import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import beaconState from '../beacons/beacon-state';
import SafeComponent from './safe-component';
import buttons from '../helpers/buttons';
import { contactState } from '../states';
import MeasureableView from './measureable-view';

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
                <MeasureableView
                    onMeasure={this.onMeasure}>
                    {buttons.roundBlueBgButton(
                        'button_syncContacts',
                        contactState.syncContacts,
                        null,
                        null,
                        { width },
                        { height: undefined }
                    )}
                </MeasureableView>
            </View>
        );
    }
}
