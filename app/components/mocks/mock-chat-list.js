import React, { Component } from 'react';
import { View, StatusBar, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import Text from '../controls/custom-text';
import PopupLayout from '../layout/popup-layout';
import ChatList from '../messaging/chat-list';
import ContactList from '../contacts/contact-list';
import SettingsLevel1 from '../settings/settings-level-1';
import Files from '../files/files';
import ChannelInvite from '../messaging/channel-invite';
import { User } from '../../lib/icebear';
import contactState from '../contacts/contact-state';
import chatState from '../messaging/chat-state';
import drawerState from '../shared/drawer-state';
import mockChatStore from './mock-chat-store';
import { vars } from '../../styles/styles';
import mockContactStore from './mock-contact-store';
import mockFileStore from './mock-file-store';
import TabContainer from '../layout/tab-container';
import { TopDrawerMaintenance, /* TopDrawerNewContact, */ TopDrawerPendingFiles, TopDrawerAutoMount } from '../shared/top-drawer-components';

const button = {
    position: 'absolute',
    width: 50,
    height: 50,
    bottom: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 1
};

const add1 = [
    button,
    {
        left: 50,
        backgroundColor: 'green'
    }
];

const add2 = [
    button,
    {
        right: 150,
        backgroundColor: 'blue'
    }
];

const remove = [
    button,
    {
        right: 50,
        backgroundColor: 'red'
    }
];

@observer
export default class MockChatList extends Component {
    componentWillMount() {
        User.current = mockContactStore.createMockCurrentUser();
        mockFileStore.install();
        chatState.store = mockChatStore;
        chatState.init();
        contactState.store = mockContactStore;
        contactState.init();
        const { chats } = chatState.store;
        chats[0].unreadCount = 2;
        chats[chats.length - 1].unreadCount = 3;
    }

    addGlobalDrawer = () => {
        drawerState.addDrawer(TopDrawerMaintenance);
    };

    addLocalDrawer = () => {
        drawerState.addDrawer(TopDrawerPendingFiles, 'files');
    };

    removeDrawer = () => {
        drawerState.drawers.pop();
    };

    get list() {
        const { route } = chatState.routerMain;
        switch (route) {
            case 'channelInviteList':
                return <ChannelInvite />;
            case 'settings':
                return <SettingsLevel1 />;
            case 'chats':
                return <ChatList />;
            case 'contacts':
                return <ContactList />;
            case 'files':
                return <Files />;
            default:
                return <ChatList />;
        }
    }

    get drawerControl() {
        return (
            <View>
                <TouchableOpacity
                    style={add1}
                    onPress={this.addGlobalDrawer}
                    pressRetentionOffset={vars.retentionOffset}
                >
                    <Text semibold style={{ textAlign: 'center' }}>
                        Add Global
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={add2}
                    onPress={this.addLocalDrawer}
                    pressRetentionOffset={vars.retentionOffset}
                >
                    <Text semibold style={{ textAlign: 'center' }}>
                        Add Local
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={remove}
                    onPress={this.removeDrawer}
                    pressRetentionOffset={vars.retentionOffset}
                >
                    <Text semibold style={{ textAlign: 'center' }}>
                        Delete
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, flexGrow: 1, paddingTop: vars.layoutPaddingTop }}>
                {this.list}
                <TabContainer />
                <PopupLayout key="popups" />
                <StatusBar barStyle="default" />
                <TopDrawerAutoMount />
            </View>
        );
    }
}
