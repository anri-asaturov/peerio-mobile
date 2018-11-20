import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import ComposeMessage from '../messaging/compose-message';
import CreateChannel from '../channels/create-channel';
import contactState from '../contacts/contact-state';
import { User } from '../../lib/icebear';
import mockContactStore from './mock-contact-store';

@observer
export default class MockChannelCreate extends Component {
    @observable isChatMode = true;

    componentDidMount() {
        User.current = {};
        contactState.store = mockContactStore;
    }

    createChannel = () => {
        this.isChatMode = false;
    };

    createChat = () => {
        this.isChatMode = true;
    };

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, flexGrow: 1 }}>
                {this.isChatMode ? (
                    <ComposeMessage createChannel={this.createChannel} />
                ) : (
                    <CreateChannel createChat={this.createChat} />
                )}
                <StatusBar barStyle="default" />
            </View>
        );
    }
}
