import React from 'react';
import { observer } from 'mobx-react/native';
import { computed, when } from 'mobx';
import ChatList from '../../../components/messaging/chat-list';
import chatState from '../../../components/messaging/chat-state';
import BackIcon from '../../layout/back-icon';
import routes from '../../routes/routes';
import ChannelInviteListItem from '../../../components/messaging/channel-invite-list-item';
import ChannelListItem from '../../../components/messaging/channel-list-item';

@observer
export default class MedcryptorSpaceScreen extends ChatList {
    componentWillMount() {
        chatState.spaceOpen = true;
        this.goBackReaction = when(() => !chatState.store.spaces.currentSpace, routes.main.chats);
    }

    componentWillUnmount() {
        chatState.spaceOpen = false;
        this.goBackReaction && this.goBackReaction();
    }

    get rightIcon() {
        return null;
    }

    get leftIcon() {
        return <BackIcon testID="buttonBackIcon" action={routes.main.chats} />;
    }

    @computed
    get firstSectionItems() {
        return chatState.store.spaces.currentSpace
            ? chatState.store.spaces.currentSpace.internalRooms
            : [];
    }

    @computed
    get secondSectionItems() {
        return chatState.store.spaces.currentSpace
            ? chatState.store.spaces.currentSpace.patientRooms
            : [];
    }

    @computed
    get dataSource() {
        return [].concat(
            ...this.addSection('mcr_title_internalRooms', this.firstSectionItems),
            ...this.addSection('mcr_title_patientRooms', this.secondSectionItems)
        );
    }

    get sectionTitles() {
        return ['mcr_title_internalRooms', 'mcr_title_patientRooms'];
    }

    inviteItem = chat => (
        <ChannelInviteListItem
            id={chat.kegDbId}
            chat={chat}
            channelName={chat.chatHead.nameInSpace}
        />
    );
    channelItem = chat => <ChannelListItem chat={chat} channelName={chat.chatHead.nameInSpace} />;
}
