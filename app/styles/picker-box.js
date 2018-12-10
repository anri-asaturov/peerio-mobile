import vars from './vars';

const iconContainer = {
    position: 'absolute',
    right: 0,
    top: 0
};

const icon = {
    backgroundColor: 'transparent'
};

const shadowNormal = {
    height: vars.inputHeight,
    marginTop: vars.spacing.small.midi,
    marginBottom: vars.spacing.small.midi,
    paddingHorizontal: vars.inputPaddingHorizontal,
    borderColor: vars.inputBorderColor,
    borderWidth: 1,
    borderRadius: 4,
    overflow: 'hidden'
};

const shadowActive = {
    shadowOpacity: 0.4,
    shadowRadius: 5,
    shadowOffset: {
        height: 1,
        width: 1
    },
    paddingHorizontal: vars.inputPaddingHorizontal
};

const inputActive = {
    flexGrow: 1,
    height: vars.inputHeight,
    color: vars.textBlack38
};

const inputContainer = {
    height: vars.inputHeight,
    opacity: 1,
    marginTop: -2
};

const errorStyle = {
    fontSize: vars.font.size12,
    color: vars.red,
    margin: vars.spacing.medium.mini2x,
    marginTop: -4,
    marginBottom: vars.spacing.small.mini2x,
    height: vars.spacing.medium.mini2x
};

export default {
    normal: {
        textview: [
            inputActive,
            {
                color: vars.textBlack38,
                top: 16
            }
        ],
        shadow: [
            shadowNormal,
            {
                backgroundColor: 'transparent'
            }
        ],
        background: {
            backgroundColor: 'transparent'
        },
        container: inputContainer,
        iconContainer,
        icon
    },
    active: {
        textview: [
            inputActive,
            {
                top: 16
            }
        ],
        shadow: [
            shadowActive,
            {
                backgroundColor: 'transparent'
            }
        ],
        background: {
            backgroundColor: 'transparent'
        },
        container: [
            inputContainer,
            {
                backgroundColor: 'transparent'
            }
        ],
        iconContainer,
        icon
    },
    errorStyle
};
