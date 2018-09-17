import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { View, StatusBar } from 'react-native';
import { observer } from 'mobx-react/native';
import Text from '../controls/custom-text';
import PopupLayout from '../layout/popup-layout';
import { User } from '../../lib/icebear';
import contactState from '../contacts/contact-state';
import { vars } from '../../styles/styles';
import mockContactStore from './mock-contact-store';
import BeaconLayout from '../beacons/beacon-layout';
import routes from '../routes/routes';
import buttons from '../helpers/buttons';
import MockTabContainer from './mock-tab-container';
import { uiState } from '../states';

@observer
export default class MockBeacon extends Component {
    @observable showVertical = false;
    @observable showTop = false;
    @observable showLeft = false;

    componentWillMount() {
        User.current = mockContactStore.createMock();
        User.current.activePlans = [];
        contactState.store = mockContactStore;
        contactState.init();
        routes.main.route = 'chats';
    }

    @action.bound toggleTopBottom() {
        this.showVertical = true;
        this.showTop = !this.showTop;
        this.showLeft = false;
    }

    @action.bound toggleLeftRight() {
        this.showVertical = false;
        this.showLeft = !this.showLeft;
        this.showTop = false;
    }

    @action.bound toggleArrow() {
        uiState.mockBeaconArrowDirection = !uiState.mockBeaconArrowDirection;
    }

    @action.bound toggleBeaconType() {
        uiState.mockBeaconType = !uiState.mockBeaconType;
    }

    @action.bound toggleHorizontalPadding() {
        this.padding = this.padding ? 0 : 100;
    }

    get list() {
        const containerStyle = {
            flexGrow: 1,
            backgroundColor: vars.lightGrayBg,
            flexDirection: 'row',
            paddingLeft: this.showLeft ? this.padding : 0,
            paddingRight: !this.showLeft ? this.padding : 0
        }
        return (
            <View style={containerStyle}>
                {!this.showVertical && this.showLeft && <MockTabContainer vertical />}
                <View style={{ flex: 1, flexGrow: 1, backgroundColor: vars.white, paddingHorizontal: 20, paddingVertical: 50 }}>
                    <Text>1. Click on any icon to see its beacon.</Text>
                    <Text>2. Use the blue buttons to change the location of the icons</Text>
                    <Text>3. Use the white buttons to change change beacon properties (must refresh by pressing any blue button afterwards)</Text>
                    <Text>(Left/Right padding changes the position of the arrow with respect to the beacon)</Text>
                    {buttons.roundBlueBgButton('Toggle Top/Bottom Beacons', this.toggleTopBottom)}
                    {buttons.roundBlueBgButton('Toggle Left/Right Beacons', this.toggleLeftRight)}
                    {buttons.roundWhiteBgButton('Toggle arrow orientation', this.toggleArrow)}
                    {buttons.roundWhiteBgButton('Toggle Area/Spot beacon', this.toggleBeaconType)}
                    {buttons.roundWhiteBgButton('Toggle Left/Right Padding', this.toggleHorizontalPadding)}
                </View>
                {!this.showVertical && !this.showLeft && <MockTabContainer vertical />}
            </View>);
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, flexGrow: 1, paddingTop: vars.layoutPaddingTop }}>
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
