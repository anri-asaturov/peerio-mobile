import React from 'react';
import { observer } from 'mobx-react/native';
import { Image, TouchableOpacity } from 'react-native';
import vars from '../../styles/vars';
import icons from '../helpers/icons';
import beaconState from '../beacons/beacon-state';
import MeasureableView from '../shared/measureable-view';
import testLabel from '../helpers/test-label';

@observer
export default class MeasureableIcon extends MeasureableView {
    request = (beacon, position) => {
        const { onPress, spotBgColor } = this.props;
        beacon.position = position;
        beacon.content = this.content;
        beacon.onPressIcon = onPress;
        beacon.spotBgColor = spotBgColor;
        beaconState.requestBeacon(beacon);
    };

    onMeasure = position => {
        const { beacon } = this.props;
        if (!beacon) {
            console.log('MeasureableIcon: ignoring empty beacon');
            return;
        }
        if (Array.isArray(beacon)) {
            beacon.forEach(b => this.request(b, position));
        } else {
            this.request(beacon, position);
        }
    };

    componentWillUnmount() {
        if (this.props.beacon) beaconState.removeBeacon(this.props.beacon.id);
    }

    get content() {
        const { iconSource, icon, color, testId } = this.props;
        if (iconSource) {
            return (
                <Image
                    source={iconSource}
                    style={{ width: vars.iconSize, height: vars.iconSize }}
                />
            );
        }
        return icons.plain(icon, undefined, color, testId);
    }

    renderThrow() {
        const { onPress } = this.props;
        return (
            <TouchableOpacity
                {...testLabel(this.props.testId)}
                pressRetentionOffset={vars.retentionOffset}
                onPress={onPress}>
                <MeasureableView onMeasure={this.props.beacon ? this.onMeasure : null}>
                    {this.content}
                </MeasureableView>
            </TouchableOpacity>
        );
    }
}
