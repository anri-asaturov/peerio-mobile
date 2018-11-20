import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import DateSeparator from './date-separator';
import ChatMessageCollapsed from './chat-message-collapsed';
import ChatMessageFull from './chat-message-full';

@observer
export default class ChatMessageContainer extends SafeComponent {
    get errorStyle() {
        return this.props.messageObject.sendError
            ? {
                  backgroundColor: '#ff000020',
                  borderRadius: 14,
                  marginVertical: vars.spacing.small.mini,
                  marginHorizontal: vars.spacing.small.mini2x
              }
            : null;
    }

    get backgroundColor() {
        return {
            backgroundColor: this.props.backgroundColor || vars.white
        };
    }

    get innerProps() {
        return {
            messageObject: this.props.messageObject,
            chat: this.props.chat,
            onFileAction: this.props.onFileAction,
            onLegacyFileAction: this.props.onLegacyFileAction,
            onInlineImageAction: this.props.onInlineImageAction,
            backgroundColor: this.backgroundColor,
            errorStyle: this.errorStyle
        };
    }

    renderThrow() {
        const { messageObject } = this.props;

        const collapsed = !!messageObject.groupWithPrevious;
        const opacity = messageObject.sending ? 0.5 : 1;
        const activeOpacity = !messageObject.signatureError && !messageObject.sendError ? 1 : 0.2;

        const inner = collapsed ? (
            <ChatMessageCollapsed {...this.innerProps} />
        ) : (
            <ChatMessageFull {...this.innerProps} />
        );

        return (
            <View style={{ backgroundColor: vars.chatItemPressedBackground }}>
                <TouchableOpacity
                    pressRetentionOffset={vars.retentionOffset}
                    activeOpacity={activeOpacity}
                    style={this.backgroundColor}>
                    <DateSeparator
                        visible={messageObject.firstOfTheDay}
                        timestamp={messageObject.timestamp}
                    />
                    <View style={{ opacity }}>{inner}</View>
                </TouchableOpacity>
            </View>
        );
    }
}

ChatMessageContainer.propTypes = {
    messageObject: PropTypes.any,
    chat: PropTypes.any,
    onFileAction: PropTypes.any,
    onLegacyFileAction: PropTypes.any,
    onInlineImageAction: PropTypes.any,
    backgroundColor: PropTypes.any,
    errorStyle: PropTypes.any
};
