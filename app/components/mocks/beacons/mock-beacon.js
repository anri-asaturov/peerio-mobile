import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { View, StatusBar } from 'react-native';
import { observer } from 'mobx-react/native';
import Text from '../../controls/custom-text';
import PopupLayout from '../../layout/popup-layout';
import { vars } from '../../../styles/styles';
import mockStoresCreate from '../mock-stores-create';
import BeaconLayout from '../../beacons/beacon-layout';
import routes from '../../routes/routes';
import MockTabContainer from './mock-tab-container';
import { uiState } from '../../states';
import AreaBeacon from '../../beacons/area-beacon';
import SpotBeacon from '../../beacons/spot-beacon';
import beaconState from '../../beacons/beacon-state';
import WhiteRoundButton from '../../buttons/white-round-button';

@observer
export default class MockBeacon extends Component {
    @observable showVertical = true;
    @observable showTop = false;
    @observable showLeft = false;
    @observable padding;

    componentWillMount() {
        mockStoresCreate();
        routes.main.route = 'chats';
    }

    @action.bound
    toggleTopBottom() {
        this.showVertical = true;
        this.showTop = !this.showTop;
        this.showLeft = false;
    }

    @action.bound
    toggleLeftRight() {
        this.showVertical = false;
        this.showLeft = !this.showLeft;
        this.showTop = false;
    }

    @action.bound
    toggleArrow() {
        uiState.mockBeaconArrowDirection = !uiState.mockBeaconArrowDirection;
        beaconState.activeBeacon.sidePointer = !uiState.mockBeaconArrowDirection;
    }

    @action.bound
    toggleBeaconType() {
        uiState.mockBeaconType = !uiState.mockBeaconType;
        beaconState.activeBeacon.component = uiState.mockBeaconType ? AreaBeacon : SpotBeacon;
    }

    @action.bound
    toggleHorizontalPadding() {
        this.padding = this.padding ? 0 : 100;
    }

    get list() {
        const containerStyle = {
            flexGrow: 1,
            backgroundColor: vars.lightGrayBg,
            flexDirection: 'row',
            paddingLeft: this.showLeft ? this.padding : 0,
            paddingRight: !this.showLeft ? this.padding : 0
        };
        return (
            <View style={containerStyle}>
                {!this.showVertical && this.showLeft && <MockTabContainer vertical />}
                <View
                    style={{
                        flex: 1,
                        flexGrow: 1,
                        backgroundColor: vars.white,
                        paddingHorizontal: 20,
                        paddingVertical: 50
                    }}>
                    <Text>1. Click on any icon to see its beacon</Text>
                    <Text>2. Use the buttons to change beacon properties</Text>
                    <WhiteRoundButton text="Toggle Top/Bottom" onPress={this.toggleTopBottom} />
                    <WhiteRoundButton text="Toggle Left/Right" onPress={this.toggleLeftRight} />
                    <WhiteRoundButton text="Toggle Arrow Orientation" onPress={this.toggleArrow} />
                    <WhiteRoundButton
                        text="Toggle Area/Spot Beacon"
                        onPress={this.toggleBeaconType}
                    />
                    <WhiteRoundButton
                        text="Toggle Left/Right Padding"
                        onPress={this.toggleHorizontalPadding}
                    />
                    <Text>
                        (Left/Right padding causes beacon position on the page to change, which
                        changes the position of the arrow with respect to the beacon when the arrow
                        is oriented horizontally)
                    </Text>
                </View>
                {!this.showVertical && !this.showLeft && <MockTabContainer vertical />}
            </View>
        );
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
                {this.showVertical && this.showTop && <MockTabContainer />}
                {this.list}
                {this.showVertical && !this.showTop && <MockTabContainer />}
                <PopupLayout key="popups" />
                <StatusBar barStyle="default" />
                <BeaconLayout />
            </View>
        );
    }
}
