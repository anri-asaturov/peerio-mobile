import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import ComposeMessage from '../messaging/compose-message';
import CreateChannel from '../channels/create-channel';
import mockStoresCreate from './mock-stores-create';

@observer
export default class MockChannelCreate extends Component {
    @observable isChatMode = true;

    componentDidMount() {
        mockStoresCreate();
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
