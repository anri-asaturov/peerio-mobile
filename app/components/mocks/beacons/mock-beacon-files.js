import React, { Component } from 'react';
import { action } from 'mobx';
import { View, StatusBar } from 'react-native';
import { observer } from 'mobx-react/native';
import PopupLayout from '../../layout/popup-layout';
import { vars } from '../../../styles/styles';
import mockStoresCreate from '../mock-stores-create';
import BeaconLayout from '../../beacons/beacon-layout';
import routes from '../../routes/routes';
import MeasureableView from '../../shared/measureable-view';
import beaconState from '../../beacons/beacon-state';
import filesBeacons from '../../beacons/files-beacons';

const filesView = {
    borderWidth: 2,
    borderColor: 'blue',
    height: 400
};

@observer
export default class MockBeaconFiles extends Component {
    componentWillMount() {
        mockStoresCreate();
        routes.main.route = 'files';
    }

    @action.bound
    onMeasure(position) {
        const beacon = filesBeacons.fileReceivedBeacon;
        beacon.position = position;
        beaconState.requestBeacon(beacon);
    }

    render() {
        return (
            <View
                style={{
                    backgroundColor: 'white',
                    flex: 1,
                    flexGrow: 1,
                    paddingTop: vars.layoutPaddingTop
                }}>
                <MeasureableView onMeasure={this.onMeasure}>
                    <View style={filesView} />
                </MeasureableView>
                <PopupLayout key="popups" />
                <StatusBar barStyle="default" />
                <BeaconLayout />
            </View>
        );
    }
}
