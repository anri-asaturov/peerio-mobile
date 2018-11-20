import branding from './branding';
import vars from './vars';
import signupStyles from './signup-styles';
import textbox from './textbox';
import styledTextInput from './styled-text-input';
import button from './button';
import circles from './circles';
import pickerBox from './picker-box';
import wizard from './wizard';
import navigator from './navigator';
import inputMain from './input-main';
import common from './common';
import debug from './debug';

const helpers = {
    circle(size) {
        return {
            width: size,
            height: size,
            borderRadius: size / 2
        };
    }
};

vars.circleTopSmall = [
    helpers.circle(vars.topCircleSizeSmall * 2),
    {
        top: 0,
        backgroundColor: vars.lightGrayBg,
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: vars.gray54
    }
];

const styles = {
    vars,
    signupStyles,
    helpers,
    textbox,
    styledTextInput,
    button,
    circles,
    pickerBox,
    common,
    wizard,
    navigator,
    inputMain,
    debug,
    branding
};

export {
    vars,
    signupStyles,
    helpers,
    textbox,
    styledTextInput,
    button,
    circles,
    pickerBox,
    common,
    wizard,
    navigator,
    inputMain,
    debug,
    branding
};
export default styles;
