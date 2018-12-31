import PropTypes from 'prop-types';
import React from 'react';
import { action } from 'mobx';
import { Image, View } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import routes from '../routes/routes';
import chatState from '../messaging/chat-state';
import AvatarCircle from '../shared/avatar-circle';
import IdentityVerificationNotice from './identity-verification-notice';
import Text from '../controls/custom-text';
import BlueButtonText from '../buttons/blue-text-button';

const emojiTada = require('../../assets/emoji/tada.png');

const container = {
    flex: 1,
    flexGrow: 1,
    paddingTop: vars.dmInvitePaddingTop,
    alignItems: 'center'
};

const emojiStyle = {
    alignSelf: 'center',
    width: vars.iconSizeMedium,
    height: vars.iconSizeMedium,
    marginBottom: vars.spacing.small.mini2x
};

const headingStyle = {
    color: vars.lighterBlackText,
    textAlign: 'center',
    fontSize: vars.font.size16,
    lineHeight: 22
};

const inviteMethodStyle = {
    color: vars.txtMedium,
    fontSize: vars.font.size12,
    marginBottom: vars.spacing.medium.maxi2x
};

const buttonContainer = {
    flexDirection: 'row',
    marginTop: vars.spacing.large.midi2x,
    justifyContent: 'center'
};

@observer
export default class DmContactInvite extends SafeComponent {
    get chat() {
        return chatState.currentChat;
    }

    @action.bound
    async decline() {
        this.chat.dismiss();
        routes.main.chats();
    }

    @action.bound
    async accept() {
        this.chat.start();
        routes.main.chats(this.chat);
    }

    renderThrow() {
        const { showButtons } = this.props;
        const { chat } = this;
        const participant = chat.otherParticipants[0];
        console.log('participant');
        console.log(JSON.stringify(participant));
        const isReceived = chat.isReceived || chat.isNewUserFromInvite;
        const greetingCopy = isReceived ? 'title_helloDmInvite' : 'title_goodNews';
        const headingCopy = isReceived ? 'title_newUserDmInviteHeading' : 'title_dmInviteHeading';
        const inviteMethodCopy = chat.isAutoImport
            ? 'title_userInAddressBook'
            : 'title_invitedUserViaEmail';
        return (
            <View style={container}>
                <Image source={emojiTada} style={emojiStyle} resizeMode="contain" />
                <Text style={headingStyle}>{tx(greetingCopy)}</Text>
                <Text style={[headingStyle, { marginBottom: vars.spacing.medium.maxi }]}>
                    {tx(headingCopy, { contactName: participant.fullName })}
                </Text>
                {!isReceived && (
                    <Text semibold style={inviteMethodStyle}>
                        {tx(inviteMethodCopy, {
                            firstName: participant.firstName,
                            email: participant.addresses[0] || ''
                        })}
                    </Text>
                )}
                <View style={{ alignItems: 'center' }}>
                    <AvatarCircle contact={participant} medium />
                </View>
                <Text style={{ textAlign: 'center', marginBottom: vars.spacing.medium.maxi2x }}>
                    {participant.usernameTag}
                </Text>
                <IdentityVerificationNotice />
                {showButtons && (
                    <View style={buttonContainer}>
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                paddingRight: vars.spacing.medium.maxi2x
                            }}>
                            <BlueButtonText
                                text="button_dismiss"
                                onPress={this.decline}
                                accessibilityId="button_dismiss"
                            />
                        </View>
                        <View
                            style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
                            <BlueButtonText
                                text="button_message"
                                onPress={this.accept}
                                accessibilityId="button_message"
                            />
                        </View>
                    </View>
                )}
            </View>
        );
    }
}

DmContactInvite.propTypes = {
    hideButtons: PropTypes.bool
};
