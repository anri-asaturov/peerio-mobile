import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import Text from '../controls/custom-text';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import { Chat } from '../../lib/peerio-icebear/models';

export interface ChatBeginningNoticeProps {
    chat: Chat;
}

const textStyle = {
    textAlign: 'left',
    marginTop: vars.spacing.small.maxi2x,
    marginBottom: vars.spacing.small.maxi2x,
    color: vars.txtDark
};

@observer
export default class ChatBeginningNotice extends Component<ChatBeginningNoticeProps> {
    render() {
        const { chat } = this.props;
        return (
            <Text style={textStyle}>
                {!chat.isChannel && tx('title_chatBeginning', { chatName: chat.name })}
                {chat.isChannel && tx('title_chatBeginningRoom', { chatName: chat.name })}
            </Text>
        );
    }
}
