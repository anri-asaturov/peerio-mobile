import React from 'react';
import { action, observable } from 'mobx';
import { Dimensions, Image, View } from 'react-native';
import { observer } from 'mobx-react/native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import { invitationState } from '../states';
import buttons from '../helpers/buttons';
import ButtonText from '../controls/button-text';
import BackIcon from '../layout/back-icon';
import { User, chatInviteStore, contactStore } from '../../lib/icebear';
import routes from '../routes/routes';
import chatState from './chat-state';
import AvatarCircle from '../shared/avatar-circle';
import ProgressOverlay from '../shared/progress-overlay';
import uiState from '../layout/ui-state';
import { adjustImageDimensions } from '../helpers/image';
import GrayLabel from '../controls/gray-label';

const { width } = Dimensions.get('window');

const roomInviteIllustration = require('../../assets/chat/room-invite-illustration.png');

const imageContainer = {
    paddingTop: vars.spacing.large.midi,
    paddingBottom: vars.spacing.large.midixx
};

const headingContainer = {
    marginBottom: vars.spacing.medium.mini2x
};

const headingStyle = {
    color: vars.lighterBlackText,
    textAlign: 'center',
    fontSize: vars.font.size16,
    lineHeight: 22
};

const sectionLine = {
    marginHorizontal: vars.spacing.medium.mini2x,
    height: 1,
    backgroundColor: vars.black12
};

const infoSection = {
    paddingTop: vars.spacing.medium.mini,
    alignItems: 'center'
};

const infoText = {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: vars.spacing.small.maxi2x
};

const hostedByStyle = {
    color: vars.subtleText,
    fontSize: vars.font.size14
};

const hostNameStyle = {
    color: vars.black,
    fontSize: vars.font.size14
};

const buttonContainer = {
    flexDirection: 'row',
    marginTop: vars.spacing.medium.maxi2x,
    justifyContent: 'center'
};

const moreContainer = {
    backgroundColor: vars.txtLightGrey,
    height: vars.avatarDiameter,
    paddingHorizontal: vars.spacing.small.maxi2x,
    marginVertical: vars.spacing.small.mini2x,
    width: vars.avatarDiameter * 2,
    borderRadius: vars.avatarDiameter / 2,
    marginLeft: -vars.avatarDiameter,
    zIndex: -1,
    display: 'flex',
    alignItems: 'center'
};

const moreText = {
    backgroundColor: 'transparent',
    textAlign: 'right',
    alignSelf: 'flex-end',
    lineHeight: vars.avatarDiameter,
    color: vars.white,
    fontSize: vars.font.size10
};

@observer
export default class ChannelInvite extends SafeComponent {
    @observable waiting = false;

    get invitation() { return invitationState.currentInvitation; }

    get leftIcon() { return <BackIcon action={routes.main.chats} />; }

    get illustration() {
        return (
            <View style={imageContainer}>
                <Image source={roomInviteIllustration}
                    style={[adjustImageDimensions(roomInviteIllustration, width - vars.spacing.medium.mini2x * 2, null),
                        { marginBottom: vars.spacing.small.mini2x, marginHorizontal: vars.spacing.medium.mini2x }
                    ]}
                    resizeMode="contain" />
            </View>);
    }

    get heading() {
        return (
            <View style={headingContainer}>
                <Text style={headingStyle}>
                    {tx('title_roomInviteHeading')}
                </Text>
                <Text bold style={headingStyle}>
                    #{this.invitation.channelName}
                </Text>
            </View>);
    }

    get participants() {
        const { participants } = this.invitation;
        if (!participants) return null;

        const host = contactStore.getContact(this.invitation.username);

        const maxToShow = 4;
        const withoutCurrentAndHost = participants
            .filter(x => x !== User.current.username)
            .filter(x => x !== this.invitation.username);

        const toRender = withoutCurrentAndHost.slice(0, maxToShow);
        const notShown = withoutCurrentAndHost.length - maxToShow;

        return (
            <View style={infoSection}>
                <View style={{ alignItems: 'center' }}>
                    <View style={infoText}>
                        <Text style={hostedByStyle}>
                            {tx('title_whoIsAlreadyIn')}
                        </Text>
                        <Text style={hostNameStyle}>
                            &nbsp;#{this.invitation.channelName}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: vars.spacing.medium.mini2x }}>
                            <AvatarCircle contact={host} />
                            <GrayLabel contact={host} label="title_admin" />
                        </View>
                        {toRender.map(participant => (
                            <View style={{ marginLeft: -vars.spacing.small.midi }}>
                                <AvatarCircle key={participant} contact={contactStore.getContact(participant)} />
                            </View>
                        ))}
                        {notShown > 0 &&
                            <View style={moreContainer}>
                                <Text bold style={moreText}>
                                    {`+${notShown}`}
                                </Text>
                            </View>}
                    </View>
                </View>
            </View>
        );
    }

    @action.bound async acceptInvite() {
        const chatId = this.invitation.kegDbId;
        chatInviteStore.acceptInvite(chatId);
        let newChat = null;
        try {
            this.waiting = true;
            newChat = await chatState.store.getChatWhenReady(chatId);
        } catch (e) {
            console.error(e);
        }
        // if we failed to accept invite, newChat is null
        // and it just goes to the chat list
        routes.main.chats(newChat);
    }

    @action.bound declineInvite() {
        uiState.declinedChannelId = this.invitation.kegDbId;
        routes.main.chats();
    }

    get buttons() {
        return (
            <View style={buttonContainer}>
                <ButtonText
                    text={tx('button_declineInvite')}
                    onPress={this.declineInvite}
                    testID="decline"
                    textColor={vars.peerioBlue}
                    style={{ marginHorizontal: vars.spacing.medium.mini2x, alignItems: 'center' }}
                />
                {buttons.roundBlueBgButton(
                    tx('button_joinRoom'),
                    this.acceptInvite,
                    null,
                    'accept',
                    { marginHorizontal: vars.spacing.small.midi2x }
                )}
            </View>);
    }

    renderThrow() {
        return (
            <View style={{ flex: 1, flexGrow: 1 }}>
                {this.illustration}
                {this.heading}
                <View style={sectionLine} />
                {this.participants}
                {this.buttons}
                <ProgressOverlay enabled={this.waiting} />
            </View>);
    }
}
