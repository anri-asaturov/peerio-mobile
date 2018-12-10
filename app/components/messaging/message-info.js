import React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, SectionList } from 'react-native';
import { contactStore } from '../../lib/icebear';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import LayoutModalExit from '../layout/layout-modal-exit';
import chatState from '../messaging/chat-state';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import ContactCard from '../shared/contact-card';
import ListSeparator from '../shared/list-separator';
import ChatMessageBody from '../shared/chat-message-body';

const messageStyle = {
    padding: vars.spacing.medium.midi,
    flex: 1,
    flexGrow: 1,
    flexShrink: 1
};

const headerStyle = {
    fontSize: 16,
    padding: 16,
    color: vars.black54,
    backgroundColor: vars.white
};

@observer
export default class MessageInfo extends SafeComponent {
    get messageText() {
        return (
            <View style={messageStyle}>
                <ChatMessageBody
                    messageObject={chatState.currentMessage}
                    chat={chatState.currentChat}
                    onFileAction={chatState.onFileAction}
                    onLegacyFileAction={chatState.onLegacyFileAction}
                    onInlineImageAction={chatState.onInlineImageAction}
                    isClosed
                />
            </View>
        );
    }

    participant = ({ item }) => {
        const c = contactStore.getContact(item.username);
        return <ContactCard contact={c} key={item.username} disableTapping />;
    };

    get sections() {
        const sections = [];
        if (this.seenBy && this.seenBy.length)
            sections.push({ data: this.seenBy, key: this.number() });
        if (this.notSeenBy && this.notSeenBy.length)
            sections.push({ data: this.notSeenBy, key: tx('title_sentTo') });

        return sections;
    }

    @computed
    get seenBy() {
        return chatState.currentMessage.receipts || [];
    }

    @computed
    get notSeenBy() {
        return chatState.currentChat.otherParticipants.filter(this.notSeen) || [];
    }

    notSeen = item => !chatState.currentMessage.receipts.some(x => x.username === item.username);

    number = () => {
        const receipts = chatState.currentMessage.receipts.length;
        const participants = chatState.currentChat.otherParticipants.length;
        if (receipts === participants) return `${tx('title_seenByAll')} (${receipts}/${receipts})`;
        return `${tx('title_seenBy')} (${receipts}/${participants})`;
    };

    headers = ({ section: { key } }) => {
        return <Text style={headerStyle}>{key}</Text>;
    };

    renderThrow() {
        if (!chatState.currentChat) return null;
        const body = (
            <View style={{ backgroundColor: vars.channelInfoBg }}>
                <View>
                    <ContactCard
                        contact={chatState.currentMessage.sender}
                        backgroundColor={vars.channelInfoBg}
                        disableTapping
                    />
                </View>
                {this.messageText}
                <ListSeparator />
                <SectionList
                    sections={this.sections}
                    keyExtractor={contact => contact.username}
                    renderItem={this.participant}
                    renderSectionHeader={this.headers}
                    style={{ marginBottom: 8 }}
                />
            </View>
        );
        return (
            <LayoutModalExit
                body={body}
                title="Message Info"
                onClose={() => chatState.routerModal.discard()}
            />
        );
    }
}
