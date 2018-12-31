import React from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import chatState from './chat-state';
import testLabel from '../helpers/test-label';
import { Chat } from '../../lib/peerio-icebear/models';

export interface ChannelListItemProps {
    channelName: string;
    chat: Chat;
    onPress?: Function;
}

@observer
export default class ChannelListItem extends SafeComponent<ChannelListItemProps> {
    onPress = () => {
        const { chat, onPress } = this.props;
        if (onPress) return onPress(chat);
        return chatState.routerMain.chats(chat);
    };

    renderThrow() {
        if (chatState.collapseChannels) return null;
        const { chat, channelName } = this.props;
        if (!chat) return null;
        const { unreadCount, headLoaded } = chat;
        if (chat.isChannel && !headLoaded) return null;

        const containerStyle = {
            height: vars.sectionHeaderHeight,
            paddingHorizontal: vars.spacing.medium.midi,
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: vars.white,
            flexDirection: 'row'
        };

        const textStyle = {
            fontSize: vars.font.size16,
            color: vars.subtleText
        };

        const textUnreadStyle = { color: vars.unreadTextColor };

        const circleStyle = {
            width: vars.unreadCircleWidth,
            height: vars.unreadCircleHeight,
            borderRadius: 14,
            backgroundColor: vars.peerioTeal,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center'
        };

        const textCircleStyle = {
            fontSize: vars.font.size14,
            color: vars.badgeText
        };
        const hasUnread = unreadCount > 0;
        return (
            <View style={{ backgroundColor: vars.chatItemPressedBackground }}>
                <TouchableOpacity
                    {...testLabel(channelName)}
                    onPress={this.onPress}
                    style={containerStyle as ViewStyle}
                    pressRetentionOffset={vars.retentionOffset}>
                    <Text semibold={hasUnread} style={[textStyle, hasUnread && textUnreadStyle]}>
                        {`# ${channelName}`}
                    </Text>
                    {unreadCount > 0 && (
                        <View style={circleStyle as ViewStyle}>
                            <Text semibold style={textCircleStyle}>
                                {unreadCount}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        );
    }
}
