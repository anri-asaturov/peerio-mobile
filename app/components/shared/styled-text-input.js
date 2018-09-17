import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { observable, action, reaction } from 'mobx';
import { TextInput, View, Platform, Animated } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import uiState from '../layout/ui-state';
import { vars, styledTextInput } from '../../styles/styles';
import icons from '../helpers/icons';
import testLabel from '../helpers/test-label';
import { tx } from '../utils/translator';
import { socket } from '../../lib/icebear';
import tm from '../../telemetry';

// Because JS has no enums
const VALID = true;
const INVALID = false;
const UNDEFINED = undefined;

const borderOffset = { marginTop: -2 };

@observer
export default class StyledTextInput extends SafeComponent {
    @observable valid;
    @observable focused = false;
    @observable showSecret = false;
    @observable start = 0;
    @observable end = 0;
    @observable focusedAnim;
    @observable errorTextCopy;
    @observable isDirty = false;
    prevTextLength = 0;

    constructor(props) {
        super(props);
        if (this.props.alwaysDirty) {
            this.validate();
        } else this.valid = UNDEFINED;
        this.focusedAnim = new Animated.Value(0);
    }

    componentDidMount() {
        this.reaction = reaction(() => socket.connected, () => {
            // Only run validation on reconnect, not on disconnect
            if (socket.connected) this.validate();
        }, true);
    }

    componentWillUnmount() {
        if (uiState.focusedTextBox === this.textInput) {
            uiState.focusedTextBox = null;
        }
        this.reaction && this.reaction();
        this.reaction = null;
    }

    get isValid() { return this.valid === VALID; }

    /**
     * Sets validation state to INVALID and displays the custom error
     * @param {String} error - The error to be displayed
     */
    @action.bound setCustomError(error) {
        this.valid = INVALID;
        this.errorTextCopy = error;
        tm.shared.textInputOnError(this.props.inputName, error);
    }

    // Checks if text field is empty and validates accordingly
    handleEmptyField() {
        const { validations, alwaysDirty, state, required, testID } = this.props;
        try {
            if (!state.value) {
                if (alwaysDirty) {
                    this.valid = INVALID;
                    this.errorTextCopy = validations[0].message;
                    throw new Error();
                }
                if (required && this.isDirty) {
                    this.valid = INVALID;
                    this.errorTextCopy = 'error_fieldRequired';
                }
            }
        } catch (error) {
            console.log(`Text Input ${testID}: No text to validate`);
        }
    }

    /**
     * Validates user input against each validation object in an array of validation objects
     * @prop {Array} validations - Array of validation objects
     * @prop {Object} validation - Consists of "action" and "message"
     * @prop {Func} validation.action - Validates "input". Returns true/false (VALID/INVALID)
     * @prop {String} validation.message - The error to show if validation fails at action
     */
    @action.bound async validate() {
        const { validations, alwaysDirty, state } = this.props;
        // Do not run validation on a field that hasn't been modified yet unless it is alwaysDirty
        if (!this.isDirty && !alwaysDirty) return;
        this.handleEmptyField();
        // If no validation prop is passed, then no validation is needed and it is always valid
        if (!validations) {
            this.valid = VALID;
            return;
        }
        // Always dirty means the component's intial state will always be INVALID
        if (alwaysDirty) {
            // If its always dirty, assume it only has one validation method
            this.valid = INVALID;
            this.errorTextCopy = validations[0].message;
        }
        // Create a promise chain in order to execute one validation at a time
        // Next validation gets executed only if the previous one returns VALID
        let promise = Promise.resolve();
        validations.forEach((validation) => {
            promise = promise.then(async () => {
                const { value } = state;
                const result = await validation.action(state.value)
                    .then((valid) => {
                        // Validation is inapplicable because it is validating against old input
                        if (value !== state.value) return false;
                        this.valid = valid;
                        if (valid === INVALID) {
                            this.errorTextCopy = validation.message;
                            tm.shared.textInputOnError(this.props.inputName, this.errorTextCopy);
                            return false;
                        }
                        return true;
                    });
                // Throw an error to break the chain if a validation action returns INVALID
                if (result === false) {
                    throw new Error(this.errorTextCopy);
                }
            });
        });
        // We need this catch in order to break the chain when one of the validations is INVALID
        promise = promise.catch(() => {
            // Do nothing
        });

        await promise;
    }

    @action.bound async onChangeText(text) {
        this.isDirty = true;
        // key is entered and the key is '@'
        if (this.props.tmTrackEmailError &&
            this.prevTextLength + 1 === text.length && text[text.length - 1] === '@') {
            tm.login.onLoginWithEmail(this.props.label, tx('error_usingEmailInUsernameField'));
        }
        let inputText = text;
        const { Version, OS } = Platform;
        if (OS !== 'android' || Version > 22) {
            inputText = this.props.lowerCase ? text.toLowerCase() : text;
        }
        this.props.state.value = inputText;
        this.prevTextLength = inputText.length;
        this.validate();
    }

    onSelectionChange = ({ nativeEvent: { selection: { start, end } } }) => {
        if (this._skip) {
            this._skip = false;
            return;
        }
        this.start = start;
        this.end = end;
    };

    @action.bound async onBlur() {
        uiState.focusedTextBox = null;
        this.focused = false;
        if (this.props.onBlur) this.props.onBlur();
        await this.validate();
        if (this.valid === INVALID) tm.shared.textInputOnBlur(this.props.inputName, this.errorTextCopy);
    }

    @action.bound onFocus() {
        uiState.focusedTextBox = this.textInput;
        this.focused = true;
        if (this.props.onFocus) this.props.onFocus();
        this.textInput.focus();
        tm.shared.textInputOnFocus(this.props.inputName);
    }

    get borderColor() {
        if (this.valid === INVALID) return vars.red;
        else if (this.focused) return vars.peerioBlue;
        return vars.inputBorderColor;
    }

    get label() {
        let color = vars.textBlack54;
        if (this.focused) color = vars.peerioBlue;
        if (this.valid === INVALID) color = vars.red;
        const labelStyle = {
            fontSize: vars.font.size.smaller,
            alignSelf: 'center',
            color
        };
        return (this.props.label &&
            <View pointerEvents="none" style={styledTextInput.labelContainerStyle}>
                <Text style={labelStyle}>{this.props.label}</Text>
            </View>
        );
    }

    @action.bound toggleSecret() {
        const { state } = this.props;
        // we don't give user the ability to hide passphrase again, because Apple
        this.showSecret = !this.showSecret;
        tm.login.toggleAkVisibility(this.showSecret);
        // prevent cursor skip
        if (state.value && Platform.OS === 'android') this._skip = true;
    }

    @action.bound clearInputValue() {
        this.props.state.value = '';
        this.onChangeText('');
        tm.shared.textInputOnClear(this.props.inputName);
    }

    get customIcon() {
        return (<View style={[styledTextInput.iconContainer, borderOffset]}>
            {this.props.customIcon}
        </View>
        );
    }

    get secretIcon() {
        return (<View style={[styledTextInput.iconContainer, borderOffset]}>
            {this.showSecret ?
                icons.colored('visibility', this.toggleSecret, vars.peerioTeal, 'transparent') :
                icons.dark('visibility', this.toggleSecret, { backgroundColor: 'transparent' })}
        </View>
        );
    }

    get clearTextIcon() {
        return (<View style={[styledTextInput.iconContainer, borderOffset]}>
            {icons.dark('clear', this.clearInputValue, { backgroundColor: 'transparent' })}
        </View>);
    }

    // icon priority: custom > secureText > clearText
    get rightIcon() {
        const { customIcon, secureText, clearTextIcon, state } = this.props;
        if (customIcon) return this.customIcon;
        else if (secureText) return this.secretIcon;
        else if (clearTextIcon && state.value) return this.clearTextIcon;
        return null;
    }

    // reserves space below text input for error or helper message
    get bottomTextSpacer() {
        const marginBottom = styledTextInput.bottomMessageContainer.height
            + styledTextInput.bottomMessageContainer.marginTop
            + styledTextInput.bottomMessageContainer.marginBottom;
        return (<View style={{ marginBottom }} />);
    }

    get errorText() {
        const marginRight = vars.spacing.small.mini;
        return (
            <View style={styledTextInput.bottomMessageContainer}>
                {icons.plainalert('error-outline', vars.iconSizeSmall, { marginRight })}
                <Text style={styledTextInput.errorTextStyle}>
                    {tx(this.errorTextCopy)}
                </Text>
            </View>
        );
    }

    get helperText() {
        const { helperText } = this.props;
        return (
            <View style={styledTextInput.bottomMessageContainer}>
                <Text style={styledTextInput.helperTextStyle}>
                    {tx(helperText)}
                </Text>
            </View>
        );
    }

    get bottomText() {
        if (this.valid === INVALID) return this.errorText;
        else if (this.props.helperText && this.focused) return this.helperText;
        return this.bottomTextSpacer;
    }

    @action.bound textInputRef(ref) { this.textInput = ref; }

    renderThrow() {
        const { style, state, secureText, maxLength, testID } = this.props;
        const { start, end } = this;
        const fieldStyle = {
            height: vars.inputHeight,
            borderColor: this.borderColor,
            borderWidth: 1,
            borderRadius: 4,
            overflow: 'hidden'
        };
        const paddingRight = { paddingRight: this.rightIcon ? vars.iconSizeLarge : null };
        return (
            <View style={styledTextInput.inputContainer}>
                <View style={fieldStyle}>
                    {this.rightIcon}
                    <TextInput
                        style={[styledTextInput.textinputStyle, style, paddingRight]}
                        value={state.value}
                        secureTextEntry={secureText && !this.showSecret}
                        maxLength={maxLength}
                        selection={{ start, end }}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete={false}
                        onSelectionChange={this.onSelectionChange}
                        onChangeText={this.onChangeText}
                        ref={this.textInputRef}
                        onBlur={this.onBlur}
                        onFocus={this.onFocus}
                        {...testLabel(testID)}
                        {...this.props} />
                </View>
                {this.bottomText}
                {this.label}
            </View>
        );
    }
}

StyledTextInput.propTypes = {
    state: PropTypes.any,
    style: PropTypes.any,
    inputName: PropTypes.string,
    validations: PropTypes.any,
    label: PropTypes.any,
    testID: PropTypes.any,
    alwaysDirty: PropTypes.bool,
    customIcon: PropTypes.any,
    secureText: PropTypes.bool,
    clearTextIcon: PropTypes.bool,
    required: PropTypes.bool,
    helperText: PropTypes.string,
    maxLength: PropTypes.number,
    onBlur: PropTypes.any,
    onFocus: PropTypes.any,
    lowerCase: PropTypes.bool,
    tmTrackEmailError: PropTypes.bool
};
