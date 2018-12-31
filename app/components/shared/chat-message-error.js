import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import Text from '../controls/custom-text';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';

const notSentMessageStyle = {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: vars.spacing.small.midi2x
};

@observer
export default class ChatMessageSendError extends SafeComponent {
    renderThrow() {
        if (!this.props.visible) return null;

        return (
            <View style={notSentMessageStyle}>
                <Text style={{ color: vars.txtAlert }}>{tx('error_messageSendFail')}</Text>
            </View>
        );
    }
}

ChatMessageSendError.propTypes = {
    message: PropTypes.any
};
