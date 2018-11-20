import React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react/native';
import medcryptorChatState from './medcryptor-chat-state';
import MedcryptorSpaceListItem from './medcryptor-space-list-item';
import MedcryptorChatZeroStatePlaceholder from './medcryptor-chat-zero-state-placeholder';
import ChatList from '../../../components/messaging/chat-list';
import ChatSectionHeader from '../../messaging/chat-section-header';
import { tx } from '../../utils/translator';

@observer
export default class MedCryptorChatList extends ChatList {
    @computed
    get firstSectionItems() {
        return medcryptorChatState.store.nonSpaceRooms;
    }

    @computed
    get dataSource() {
        return [].concat(
            ...this.addSection('title_channels', this.firstSectionItems),
            ...this.addSection(
                'mcr_title_patientFiles',
                medcryptorChatState.store.spaces.spacesList
            ),
            ...this.addSection('title_directMessages', this.secondSectionItems)
        );
    }

    zeroStatePlaceholder() {
        return <MedcryptorChatZeroStatePlaceholder />;
    }

    spaceItem = chat => {
        return <MedcryptorSpaceListItem space={chat} />;
    };

    keyExtractor(item) {
        return item.kegDbId || item.id || item.title || item.spaceId || item.sectionTitle;
    }

    renderListItem = chat => {
        if (chat.kegDbId) return this.inviteItem(chat);
        if (chat.spaceName) return this.spaceItem(chat);
        if (chat.isChannel) return this.channelItem(chat);
        if (chat.sectionTitle) return <ChatSectionHeader title={tx(chat.sectionTitle)} />;

        return this.dmItem(chat);
    };
}
