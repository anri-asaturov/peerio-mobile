import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { observer } from 'mobx-react/native';
import PopupLayout from '../layout/popup-layout';
import ChatList from '../messaging/chat-list';
import mockStoresCreate from './mock-stores-create';
import HeaderMain from '../layout/header-main';
import { twoFactorAuthPopup } from '../settings/two-factor-auth';

@observer
export default class Mock2FAPopup extends Component {
    componentDidMount() {
        mockStoresCreate();
        twoFactorAuthPopup({
            cancel: true,
            type: 'login',
            submit() {
                console.log('submit');
            }
        });
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, flexGrow: 1 }}>
                <HeaderMain title="2FA test" />
                <ChatList />
                <PopupLayout key="popups" />
                <StatusBar barStyle="light-content" />
            </View>
        );
    }
}
