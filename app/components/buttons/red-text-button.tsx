import React from 'react';
import { TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import Text from '../controls/custom-text';
import { tu } from '../utils/translator';
import { OnPressResponder } from './OnPressResponder';
import ButtonProps from './button-props';

const buttonStyle = {
    paddingRight: vars.spacing.small.maxi2x,
    paddingVertical: vars.spacing.small.maxi
};

@observer
export default class RedButtonText extends SafeComponent<ButtonProps> {
    render() {
        const { disabled, onPress, text } = this.props;
        return (
            <TouchableOpacity
                onPress={disabled ? null : (onPress as OnPressResponder)}
                pressRetentionOffset={vars.retentionOffset}
                style={buttonStyle}>
                <Text bold style={{ color: disabled ? vars.txtMedium : vars.red }}>
                    {tu(text)}
                </Text>
            </TouchableOpacity>
        );
    }
}
