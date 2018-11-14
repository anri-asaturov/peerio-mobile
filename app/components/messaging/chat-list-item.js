import PropTypes from 'prop-types';
import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import chatState from './chat-state';
import { User } from '../../lib/icebear';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import DmTitle from '../shared/dm-title';
import AvatarCircle from '../shared/avatar-circle';
import DeletedCircle from '../shared/deleted-circle';
import ListSeparator from '../shared/list-separator';
import contactState from '../contacts/contact-state';
import testLabel from '../helpers/test-label';

const pinOn = require('../../assets/chat/icon-pin.png');

const containerStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: vars.spacing.medium.mini2x,
    paddingRight: vars.spacing.medium.mini2x
};

const newCircleStyle = {
    width: vars.roomInviteCircleWidth,
    height: vars.roomInviteCircleHeight,
    borderRadius: 5,
    backgroundColor: vars.invitedBadgeColor,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
};

const unreadCircleStyle = {
    width: vars.spacing.large.mini2x,
    paddingVertical: 1,
    borderRadius: 14,
    backgroundColor: vars.peerioTeal,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
};

const circleTextStyle = {
    fontSize: vars.font.size14,
    color: vars.badgeText
};

const textNewStyle = {
    fontSize: vars.font.size12,
    color: vars.unreadTextColor
};

const pinStyle = {
    marginLeft: -vars.spacing.medium.mini2x,
    alignSelf: 'flex-start',
    zIndex: 1
};

const titleStyle = {
    flex: 1,
    flexGrow: 1,
    marginLeft: vars.spacing.medium.mini2x,
    marginRight: vars.spacing.small.midi
};

@observer
export default class ChatListItem extends SafeComponent {
    renderNewBadge() {
        return (
            <View style={newCircleStyle}>
                <Text semibold style={textNewStyle}>
                    {tx('title_new')}
                </Text>
            </View>);
    }

    renderUnreadCountBadge() {
        const { chat } = this.props;

        return (
            <View style={unreadCircleStyle}>
                <Text semibold style={circleTextStyle}>
                    {`${chat.unreadCount}`}
                </Text>
            </View>
        );
    }

    get rightIcon() {
        const { chat } = this.props;
        if (chat.isInvite) return this.renderNewBadge();
        if (chat.unreadCount === 0) return null;
        return this.renderUnreadCountBadge();
    }

    @action.bound onPress() {
        chatState.routerMain.chats(this.props.chat);
    }

    renderThrow() {
        if (!this.props || !this.props.chat) {
            console.error('Null chat provided to chat list item');
        }
        const { chat } = this.props;
        const { otherParticipants, headLoaded } = chat;
        if (chat.isChannel && !headLoaded) {
            console.error('Head is not loaded in the provided chat list item. Still rendering');
        }
        // no participants means chat with yourself
        let contact = contactState.store.getContact(User.current.username);
        // two participants
        if (otherParticipants && otherParticipants.length === 1) {
            contact = otherParticipants[0];
        }

        const key = chat.id;
        const unread = chat.unreadCount > 0;
        // NOTE: fixed height is used for correct calculation of scrolling
        // in the parent SectionList. To prevent weird bugs with scrolling,
        // we force-fix the height here, so that if somebody forgets to update
        // the item height in section list, it would be visible
        // (-1) takes into account the separator
        const height = this.props.height ? this.props.height - 1 : undefined;
        return (
            <TouchableOpacity
                key={key}
                onPress={this.onPress}
                {...testLabel(contact.username)}
                pressRetentionOffset={vars.retentionOffset}>
                <View style={[containerStyle, { height }]}>
                    <View>
                        <View style={pinStyle}>
                            {chat.isFavorite && icons.iconPinnedChat(pinOn)}
                        </View>
                        <AvatarCircle contact={contact} loading={contact.loading} invited={contact.invited} />
                        <DeletedCircle visible={contact.isDeleted} />
                    </View>
                    <View style={[titleStyle]}>
                        <DmTitle
                            contact={contact}
                            unread={unread}
                        />
                    </View>
                    {this.rightIcon}
                </View>
                <ListSeparator />
            </TouchableOpacity>
        );
    }
}

ChatListItem.propTypes = {
    chat: PropTypes.any.isRequired
};
