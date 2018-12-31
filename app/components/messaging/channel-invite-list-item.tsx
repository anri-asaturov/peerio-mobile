import React from 'react';
import { observable, when, IReactionDisposer } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { t } from '../utils/translator';
import chatState from './chat-state';
import routes from '../routes/routes';
import testLabel from '../helpers/test-label';
import uiState from '../layout/ui-state';
import { chatInviteStore } from '../../lib/icebear';
import { transitionAnimationTimed } from '../helpers/animations';
import { Chat } from '../../lib/peerio-icebear/models';

export interface ChannelInviteListItemProps {
    id: string;
    channelName: string;
    chat: Chat;
}

@observer
export default class ChannelInviteListItem extends SafeComponent<ChannelInviteListItemProps> {
    @observable animating;
    @observable declinedStyle;
    fadeOutReaction: IReactionDisposer;

    componentDidMount() {
        this.fadeOutReaction = when(
            () => uiState.declinedChannelId === this.props.id,
            () => {
                this.declinedStyle = true;
                setTimeout(() => {
                    this.animating = true;
                    transitionAnimationTimed(2000);
                }, 400);
                chatInviteStore.rejectInvite(this.props.id);
                uiState.declinedChannelId = null;
            }
        );
    }

    componentWillReceiveProps(/* nextProps */) {
        this.animating = false;
        this.declinedStyle = false;
    }

    componentWillUnmount() {
        this.fadeOutReaction();
    }

    onPress = () => {
        const { chat } = this.props;
        routes.main.channelInvite(chat);
    };

    renderThrow() {
        if (chatState.collapseChannels) return null;
        const { channelName } = this.props;
        const containerStyle = {
            height: this.animating ? 0 : vars.sectionHeaderHeight,
            paddingHorizontal: vars.spacing.medium.midi,
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: this.declinedStyle ? vars.chatFadingOutBg : vars.white,
            flexDirection: 'row',
            overflow: 'hidden'
        };

        const textStyle = {
            fontSize: vars.font.size16,
            color: vars.unreadTextColor,
            fontWeight: 'bold',
            textDecorationLine: this.declinedStyle ? 'line-through' : 'none'
        };

        const circleStyle = {
            paddingHorizontal: 4,
            paddingVertical: 1,
            maxWidth: 32,
            borderRadius: 5,
            backgroundColor: vars.invitedBadgeColor,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center'
        };

        const textNewStyle = {
            fontSize: vars.font.size12,
            color: vars.invitedBadgeText
        };

        return (
            <View
                style={{ backgroundColor: vars.chatItemPressedBackground }}
                {...testLabel(channelName)}>
                <TouchableOpacity
                    onPress={this.onPress}
                    style={containerStyle as ViewStyle}
                    pressRetentionOffset={vars.retentionOffset}>
                    <Text semibold style={textStyle}>
                        {`# ${channelName}`}
                    </Text>
                    <View style={circleStyle as ViewStyle}>
                        <Text style={textNewStyle}>{t('title_new')}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
