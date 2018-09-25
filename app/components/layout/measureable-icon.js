import React from 'react';
import { observer } from 'mobx-react/native';
import { Image } from 'react-native';
import vars from '../../styles/vars';
import icons from '../helpers/icons';
import beaconState from '../beacons/beacon-state';
import MeasureableView from '../shared/measureable-view';

@observer
export default class MeasureableIcon extends MeasureableView {
    onMeasure = (position) => {
        const { beacon, onPress, spotBgColor } = this.props;
        if (!beacon) {
            console.log('MeasureableIcon: ignoring empty beacon');
            return;
        }
        // console.log(JSON.stringify(position));
        beacon.position = position;
        beacon.content = this.content;
        beacon.onPressIcon = onPress;
        beacon.spotBgColor = spotBgColor;
        beaconState.requestBeacon(beacon);
    };

    // TODO clean up mock beacons
    // ---------------------
    componentWillUnmount() {
        if (this.props.beacon) beaconState.removeBeacon(this.props.beacon.id);
    }

    get content() {
        const { iconSource } = this.props;
        if (iconSource) {
            return (
                <Image
                    source={iconSource}
                    style={{ width: vars.iconSize, height: vars.iconSize }}
                />
            );
        }
        return icons.plain(this.props.icon, undefined, this.props.color);
    }

    renderThrow() {
        return (
            <MeasureableView onMeasure={this.props.beacon ? this.onMeasure : null}>
                {this.content}
            </MeasureableView>
        );
    }
}
