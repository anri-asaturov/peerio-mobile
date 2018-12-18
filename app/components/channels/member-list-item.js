import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import SafeComponent from '../shared/safe-component';
import chatState from '../messaging/chat-state';
import icons from '../helpers/icons';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';
import { User } from '../../lib/icebear';
import testLabel from '../helpers/test-label';
import Text from '../controls/custom-text';
import ContactCard from '../shared/contact-card';
import GrayLabel from '../controls/gray-label';

@observer
export default class MemberListItem extends SafeComponent {
    rowStyle = {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexGrow: 1
    };

    adminTextStyle = {
        color: vars.subtleText,
        fontSize: vars.font.size11
    };

    avatarStyle = {
        flex: 1,
        flexGrow: 1
    };

    moreBtnStyle = {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center'
    };

    adminContainerStyle = {
        backgroundColor: vars.adminBadgeColor,
        borderRadius: 4,
        padding: vars.spacing.small.mini2x,
        overflow: 'hidden'
    };

    renderThrow() {
        if (chatState.collapseFirstChannelInfoList) return null;
        const { contact, channel, onRemove, section } = this.props;
        const { username } = contact;

        const isAdmin = channel.isAdmin(contact);
        const isCurrentUser = contact.username === User.current.username;
        const userStyle = {
            marginRight: isCurrentUser ? vars.spacing.huge.midi : vars.spacing.small.maxi2x
        };

        return (
            <View
                key={contact.username}
                style={this.rowStyle}
                {...testLabel(`${contact.username}-memberList`)}>
                <View style={this.avatarStyle}>
                    <ContactCard
                        contact={contact}
                        key={username}
                        backgroundColor={vars.channelInfoBg}
                    />
                </View>
                <View style={this.moreBtnStyle}>
                    {isAdmin && (
                        <View style={userStyle}>
                            <GrayLabel contact={contact} label="title_admin" />
                        </View>
                    )}
                    {channel.canIAdmin &&
                        !isCurrentUser && (
                            <Menu>
                                <MenuTrigger
                                    renderTouchable={() => (
                                        <TouchableOpacity
                                            {...testLabel('moreButton')}
                                            pressRetentionOffset={vars.retentionOffset}
                                        />
                                    )}
                                    style={{ padding: vars.iconPadding }}>
                                    {icons.plaindark('more-vert')}
                                </MenuTrigger>
                                <MenuOptions>
                                    {contact.signingPublicKey && (
                                        <MenuOption
                                            onSelect={() =>
                                                isAdmin
                                                    ? channel.demoteAdmin(contact)
                                                    : channel.promoteToAdmin(contact)
                                            }>
                                            <Text>
                                                {isAdmin
                                                    ? tx('button_demoteAdmin')
                                                    : tx('button_makeAdmin')}
                                            </Text>
                                        </MenuOption>
                                    )}
                                    <MenuOption
                                        onSelect={async () => {
                                            onRemove(contact, section);
                                        }}>
                                        <Text {...testLabel('Remove')}>{tx('button_remove')}</Text>
                                    </MenuOption>
                                </MenuOptions>
                            </Menu>
                        )}
                </View>
            </View>
        );
    }
}

MemberListItem.propTypes = {
    contact: PropTypes.any.isRequired
};
