import React from 'react';
import { observable, action, when } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, Dimensions, Image } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import StyledTextInput from '../shared/styled-text-input';
import uiState from '../layout/ui-state';
import { transitionAnimation } from '../helpers/animations';

const tfaDefaultImage =
    process.env.EXECUTABLE_NAME === 'medcryptor'
        ? require('../../assets/2fa-illustration-medcryptor.png')
        : require('../../assets/2fa-illustration.png');

const tfaFailedImage = require('../../assets/2fa-illustration-failed.png');

const { width } = Dimensions.get('window');
const imageWidth = width - 2 * vars.popupHorizontalMargin;
const headingStyle = {
    fontSize: vars.font.size18,
    marginBottom: vars.spacing.medium.mini2x,
    color: vars.textBlack87
};

const imageStyle = {
    marginTop: -1,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    width: imageWidth,
    height: imageWidth / 1.86 // image ratio
};
const inputContainer = {
    marginTop: vars.spacing.large.midixx,
    marginBottom: vars.spacing.large.maxi3x
};

@observer
export default class TwoFactorAuthPrompt extends SafeComponent {
    @observable focused = false;

    componentDidMount() {
        when(
            () => uiState.tfaFailed,
            () => {
                this.tfaInput && this.tfaInput.setCustomError('title_2FAFailed', false);
            }
        );
    }

    @action.bound
    tfaInputRef(ref) {
        this.tfaInput = ref;
    }

    @action.bound
    focus() {
        transitionAnimation();
        this.focused = true;
    }

    @action.bound
    blur() {
        transitionAnimation();
        this.focused = false;
    }

    renderThrow() {
        const { placeholder, state, title, checkbox, onSubmitEditing } = this.props;
        return (
            <View style={{ minHeight: vars.popupMinHeight }}>
                {!this.focused && (
                    <Image
                        source={uiState.tfaFailed ? tfaFailedImage : tfaDefaultImage}
                        style={imageStyle}
                        resizeMode="contain"
                    />
                )}
                <View
                    style={{
                        paddingHorizontal: vars.popupPadding,
                        paddingTop: vars.spacing.medium.maxi
                    }}>
                    <Text bold style={headingStyle}>
                        {tx(title)}
                    </Text>
                    <Text style={{ color: vars.textBlack87 }}>{tx('title_2FADetail')}</Text>
                    <View style={inputContainer}>
                        <StyledTextInput
                            state={state}
                            label={`${tx('title_2FAInputLabel')}*`}
                            placeholder={placeholder}
                            ref={this.tfaInputRef}
                            onSubmitEditing={onSubmitEditing}
                            onFocus={this.focus}
                            onBlur={this.blur}
                            testID="2faTokenInput"
                            returnKeyType="go"
                        />
                    </View>
                    {checkbox}
                </View>
            </View>
        );
    }
}
