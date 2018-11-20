import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import tagify from './tagify';
import { User } from '../../lib/icebear';
import Text from '../controls/custom-text';
import { vars } from '../../styles/styles';

const textStyle = {
    color: vars.txtMedium,
    fontSize: vars.font.size14,
    lineHeight: 22
};

@observer
export default class ChatMessageText extends SafeComponent {
    renderThrow() {
        const { message } = this.props;
        if (!message) return null;

        const text = message.replace(/\n[ ]+/g, '\n') || '';
        return (
            <Text selectable style={textStyle}>
                {tagify(text, User.current.username)}
            </Text>
        );
    }
}

ChatMessageText.propTypes = {
    message: PropTypes.any
};
