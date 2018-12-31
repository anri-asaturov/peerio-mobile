import React from 'react';
import testLabel from '../helpers/test-label';
import { TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import Text from '../controls/custom-text';
import { tu } from '../utils/translator';
import { OnPressResponder } from './OnPressResponder';
import ButtonProps from './button-props';

const buttonPadding = {
    padding: vars.spacing.medium.mini,
    marginTop: vars.spacing.small.mini2x
};

@observer
export default class WhiteButtonText extends SafeComponent<ButtonProps> {
    get buttonStyle() {
        const { disabled } = this.props;
        return {
            opacity: disabled ? 0 : 1
        };
    }

    get textStyle() {
        const { disabled } = this.props;
        return {
            backgroundColor: 'transparent',
            color: disabled ? vars.txtMedium : vars.white
        };
    }

    render() {
        const { disabled, accessibilityId, onPress, text, extraTextStyle, noPadding } = this.props;

        return (
            <TouchableOpacity
                {...testLabel(accessibilityId)}
                onPress={disabled ? null : (onPress as OnPressResponder)}
                pressRetentionOffset={vars.retentionOffset}
                style={[this.buttonStyle, !noPadding && buttonPadding]}>
                <Text style={[this.textStyle, extraTextStyle]}>{tu(text)}</Text>
            </TouchableOpacity>
        );
    }
}
