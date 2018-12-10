import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import { action } from 'mobx';
import SafeComponent from '../shared/safe-component';
import RecentFilesList from '../files/recent-files-list';
import MemberList from '../channels/member-list';
import chatState from '../messaging/chat-state';

@observer
export default class ChannelInfoListState extends SafeComponent {
    @action.bound
    toggleCollapsed() {
        chatState.collapseFirstChannelInfoList = !chatState.collapseFirstChannelInfoList;
    }

    get isCollapsed() {
        return chatState.collapseFirstChannelInfoList;
    }

    renderThrow() {
        return (
            <View>
                <View style={{ borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, .12)' }}>
                    <MemberList
                        toggleCollapsed={this.toggleCollapsed}
                        collapsed={this.isCollapsed}
                    />
                </View>
                <RecentFilesList
                    toggleCollapsed={this.toggleCollapsed}
                    collapsed={!this.isCollapsed}
                />
            </View>
        );
    }
}
