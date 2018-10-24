import vars from './vars';

const textinputStyle = {
    color: vars.black87,
    // without input height text input is rendered zero-height on iOS
    height: vars.inputHeight,
    fontSize: vars.font.size14,
    paddingHorizontal: vars.inputPaddingHorizontal
};

const bottomMessageContainer = {
    flexDirection: 'row',
    marginTop: vars.spacing.small.mini,
    height: vars.spacing.medium.midi2x
};

const errorTextStyle = {
    fontSize: vars.font.size12,
    color: vars.red
};

const helperTextFocusedStyle = {
    fontSize: vars.font.size12,
    color: vars.peerioBlue
};

const helperTextBlurredStyle = {
    fontSize: vars.font.size12,
    color: vars.textBlack54
};

const inputContainer = {
    marginTop: vars.spacing.small.midi
};

const labelContainerStyle = {
    position: 'absolute',
    top: (-vars.font.size12 / 2) - 2,
    left: vars.spacing.small.mini2x,
    backgroundColor: 'white',
    paddingLeft: vars.spacing.small.mini2x,
    paddingRight: vars.spacing.small.mini2x
};

const iconContainer = {
    flexGrow: 0,
    flexShrink: 1,
    alignSelf: 'flex-end',
    position: 'absolute',
    zIndex: 15
};

export default {
    textinputStyle,
    bottomMessageContainer,
    errorTextStyle,
    helperTextFocusedStyle,
    helperTextBlurredStyle,
    inputContainer,
    labelContainerStyle,
    iconContainer
};
