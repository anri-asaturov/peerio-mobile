import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import Text from '../controls/custom-text';
import { tx, tu } from '../utils/translator';
import ButtonProps from './button-props';
import testLabel from '../helpers/test-label';
import { OnPressResponder } from './OnPressResponder';

const touchableStyle = {
    height: vars.button.touchableHeight,
    alignItems: 'center',
    justifyContent: 'center'
};

const textStyle = {
    textAlign: 'center',
    color: vars.peerioBlue,
    fontSize: vars.font.size14
};

const subtitleStyle = {
    textAlign: 'center',
    color: vars.black54,
    fontSize: vars.font.size10
};

@observer
export default class WhiteRoundButton extends SafeComponent<ButtonProps> {
    get buttonStyle() {
        const { disabled, subtitle } = this.props;
        return {
            minWidth: vars.button.minWidth,
            height: subtitle ? vars.button.buttonHeight * 1.2 : vars.button.buttonHeight,
            paddingHorizontal: vars.button.paddingHorizontal,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: vars.button.borderRadius,
            borderColor: vars.peerioBlue,
            borderWidth: 1,
            backgroundColor: disabled ? vars.mediumGrayBg : vars.white
        };
    }

    render() {
        const { accessibilityId, disabled, onPress, style, text, subtitle } = this.props;

        return (
            <TouchableOpacity
                {...testLabel(accessibilityId)}
                disabled={disabled}
                onPress={disabled ? null : (onPress as OnPressResponder)}
                pressRetentionOffset={vars.retentionOffset}
                style={touchableStyle as ViewStyle}>
                <View style={[this.buttonStyle, style]}>
                    <Text semibold style={textStyle}>
                        {subtitle ? tx(text) : tu(text)}
                    </Text>
                    {subtitle && <Text style={subtitleStyle}>{tx(subtitle)}</Text>}
                </View>
            </TouchableOpacity>
        );
    }
}
