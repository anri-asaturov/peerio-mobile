import React from 'react';
import testLabel from '../helpers/test-label';
import { View, TouchableOpacity } from 'react-native';
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
export default class BlueButtonText extends SafeComponent<ButtonProps> {
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
        const { hidden, accessibilityId, disabled, onPress, style, text } = this.props;

        const opacity = hidden ? 0.0 : 1.0;

        return (
            <View style={{ opacity }}>
                <TouchableOpacity
                    {...testLabel(accessibilityId)}
                    disabled={disabled}
                    onPress={disabled ? null : (onPress as OnPressResponder)}
                    pressRetentionOffset={vars.retentionOffset}
                    style={[buttonStyle, style]}>
                    <Text semibold style={{ color: disabled ? vars.txtMedium : vars.peerioBlue }}>
                        {tu(text)}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}
