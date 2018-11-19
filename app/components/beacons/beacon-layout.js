import React from 'react';
import { observable, reaction } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import beaconState from './beacon-state';
import drawerState from '../shared/drawer-state';
import { timeoutWithAction } from '../utils/timeouts';
import { uiState } from '../states';

const BEACON_DELAY = 1000;

@observer
export default class BeaconLayout extends SafeComponent {
    @observable beacon = null;
    componentWillMount() {
        reaction(() => beaconState.activeBeacon, newBeacon => {
            timeoutWithAction(
                this,
                () => { this.beacon = null; },
                () => { this.beacon = newBeacon; },
                BEACON_DELAY
            );
        }, { fireImmediately: true });
    }

    static get debugHelper() {
        const { activeBeacon } = beaconState;
        if (!activeBeacon || !activeBeacon.position) return null;
        const { pageX: left, pageY: top, frameWidth: width, frameHeight: height } = activeBeacon.position;
        const s = { position: 'absolute', left, top, width, height, borderWidth: 2, borderColor: 'maroon' };
        return <View style={s} />;
    }

    renderThrow() {
        if (drawerState.getDrawer()) return null;
        const { beacon } = this;
        if (!beacon) return null;
        if (uiState.modalShown && !beacon.overModal) return null;
        console.log(`position: ${JSON.stringify(beacon.position)}`);
        return <beacon.component key={beacon.id} {...beacon} />;
    }
}
