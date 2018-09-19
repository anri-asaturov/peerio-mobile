import React from 'react';
import { observer } from 'mobx-react/native';
import icons from '../helpers/icons';
import beaconState from '../beacons/beacon-state';
import MeasureableView from '../shared/measureable-view';

@observer
export default class MeasureableIcon extends MeasureableView {
    onMeasure = (position) => {
        const { beacon, icon, onPress, spotBgColor } = this.props;
        if (!beacon) {
            console.log('MeasureableIcon: ignoring empty beacon');
            return;
        }
        // console.log(JSON.stringify(position));
        beacon.position = position;
        beacon.content = icons.plain(icon, undefined, this.props.color);
        beacon.onPressIcon = onPress;
        beacon.spotBgColor = spotBgColor;
        beaconState.requestBeacon(beacon);
    };

    // TODO clean up mock beacons
    // ---------------------
    componentWillUnmount() {
        if (this.props.beacon) beaconState.removeBeacon(this.props.beacon.id);
    }

    renderThrow() {
        return (
            <MeasureableView onMeasure={this.props.beacon ? this.onMeasure : null}>
                {icons.plain(this.props.icon, undefined, this.props.color)}
            </MeasureableView>
        );
    }
}
