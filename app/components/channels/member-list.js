import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { SectionList } from 'react-native';
import { computed } from 'mobx';
import SafeComponent from '../shared/safe-component';
import chatState from '../messaging/chat-state';
import ChatInfoSectionHeader from '../messaging/chat-info-section-header';
import { tx } from '../utils/translator';
import MemberListItem from './member-list-item';
import uiState from '../layout/ui-state';

@observer
export default class MemberList extends SafeComponent {
    get sections() {
        return [
            { data: this.channelMembers, key: tx('title_Members') },
            { data: this.channelInvites, key: tx('title_invited') }
        ];
    }

    @computed
    get channelMembers() {
        return this.data.allJoinedParticipants || [];
    }

    @computed
    get channelInvites() {
        return chatState.chatInviteStore.sent.get(this.data.id) || [];
    }

    get data() {
        return chatState.currentChat;
    }

    get hasData() {
        return !!this.channelMembers || !!this.channelInvites;
    }

    get hasChannelMembers() {
        return this.channelMembers.length;
    }

    get hasChannelInvites() {
        return this.channelInvites.length;
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
        uiState.testAction1 = null;
    }

    componentDidMount() {
        // used by a test roomInvites.feature - cancel a pending invite
        uiState.testAction1 = () => {
            if (this.channelInvites.length > 0) {
                this.onRemove(this.channelInvites[0]);
            }
        };
    }

    headers = ({ section: { key } }) => {
        let hidden = false;
        let toggleCollapsed = null;
        if (key === tx('title_Members')) {
            toggleCollapsed = this.props.toggleCollapsed;
            hidden = !this.hasChannelMembers;
        } else if (key === tx('title_invited')) {
            toggleCollapsed = null;
            hidden = this.props.collapsed || !this.hasChannelInvites;
        }
        return (
            <ChatInfoSectionHeader
                key={key}
                title={key}
                collapsed={this.props.collapsed}
                toggleCollapsed={toggleCollapsed}
                hidden={hidden}
            />
        );
    };

    onRemove = async contact => {
        if (contact.signingPublicKey) {
            await this.data.removeParticipant(contact);
        } else {
            await chatState.chatInviteStore.revokeInvite(this.data.id, contact.username);
        }
    };

    participant = ({ item, section }) => {
        return (
            <MemberListItem
                contact={item}
                section={section}
                channel={this.data}
                onRemove={this.onRemove}
            />
        );
    };

    renderThrow() {
        if (!this.hasData) return null;
        return (
            <SectionList
                sections={this.sections}
                keyExtractor={contact => contact.username}
                renderItem={this.participant}
                renderSectionHeader={this.headers}
                style={{ marginBottom: 8 }}
            />
        );
    }
}

MemberList.propTypes = {
    collapsed: PropTypes.bool,
    toggleCollapsed: PropTypes.func
};
