import vars from './vars';

const textinputStyle = {
    color: vars.black87,
    // without input height text input is rendered zero-height on iOS
    height: vars.inputHeight,
    fontSize: vars.font.size.normal,
    paddingHorizontal: vars.inputPaddingHorizontal
};

const bottomMessageContainer = {
    flexDirection: 'row',
    marginTop: vars.spacing.small.mini,
    marginBottom: vars.spacing.small.maxi,
    height: vars.spacing.medium.midi2x
};

const errorTextStyle = {
    fontSize: vars.font.size.smaller,
    color: vars.red
};

const helperTextStyle = {
    fontSize: vars.font.size.smaller,
    color: vars.peerioBlue
};

const inputContainer = {
    marginHorizontal: vars.inputMarginHorizontal,
    marginTop: vars.spacing.small.midi2x
};

const labelContainerStyle = {
    position: 'absolute',
    top: (-vars.font.size.smaller / 2) - 2,
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
    helperTextStyle,
    inputContainer,
    labelContainerStyle,
    iconContainer
};
