import React from 'react';
import { observer } from 'mobx-react/native';
/* eslint-disable */
import {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
    LayoutAnimation,
    Platform,
    Animated
} from 'react-native';
/* eslint-enable */
import { action, observable } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import { uiState } from '../states';
import testLabel from '../helpers/test-label';

const { width, height } = Dimensions.get('window');
const borderRadius = 16;

const buttonContainer = {
    backgroundColor: vars.actionSheetButtonColor,
    justifyContent: 'center',
    alignItems: 'center',
    height: vars.actionSheetOptionHeight,
    width: width - vars.spacing.small.midi2x * 2
};

const topButtonContainer = [
    buttonContainer,
    {
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius
    }
];

const bottomButtonContainer = [
    buttonContainer,
    {
        borderBottomLeftRadius: borderRadius,
        borderBottomRightRadius: borderRadius
    }
];

const lonelyButtonContainer = [
    buttonContainer,
    {
        borderRadius
    }
];

const cancelButtonContainer = [
    buttonContainer,
    {
        backgroundColor: vars.white,
        borderRadius
    }
];

const cancelButtonWrapper = {
    backgroundColor: vars.white,
    marginTop: vars.spacing.small.midi2x,
    borderRadius
};

const buttonTextStyle = {
    fontSize: vars.font.size20,
    color: vars.actionSheetFontColor,
    paddingHorizontal: vars.spacing.small.maxi2x
};

const boldButtonTextStyle = [
    buttonTextStyle,
    {
        fontWeight: 'bold'
    }
];

const lineStyle = {
    height: 1,
    width: width - vars.spacing.small.midi2x * 2,
    backgroundColor: vars.actionSheetButtonBorderColor
};

const state = observable({
    visible: false,
    config: null
});

const animatedActionsheetHeight = new Animated.Value(0);

@observer
export default class ActionSheetLayout extends SafeComponent {
    // Android border color does not work with border radius
    // Border top will be added to all action buttons except the first one
    borderTop(buttonPosition) {
        const line = <View style={lineStyle} />;
        if (buttonPosition !== 0) return line;
        return null;
    }

    async executeAction(button) {
        if (button.disabled) return;
        await ActionSheetLayout.hide();
        button.action();
    }

    actionButtons() {
        const { header, actionButtons } = state.config;
        return actionButtons.map((button, i) => {
            const topButton = i === 0 && !header;
            const bottomButton = i === actionButtons.length - 1;
            let container;
            if (topButton && bottomButton) container = lonelyButtonContainer;
            else if (!topButton && !bottomButton) container = buttonContainer;
            else if (topButton) container = topButtonContainer;
            else if (bottomButton) container = bottomButtonContainer;
            const destructiveTextstyle = button.isDestructive
                ? { color: vars.destructiveButtonFontColor }
                : null;
            const disabledTextStyle = button.disabled
                ? { color: vars.disabledButtonFontColor }
                : null;
            return (
                <View key={button.title}>
                    {this.borderTop(i)}
                    <View style={container}>
                        <TouchableOpacity
                            pressRetentionOffset={vars.retentionOffset}
                            style={container}
                            onPress={() => this.executeAction(button)}>
                            {/* Style order is important for color override priority */}
                            <Text
                                {...testLabel(button.title)}
                                style={[buttonTextStyle, destructiveTextstyle, disabledTextStyle]}>
                                {tx(button.title)}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        });
    }

    @action
    static show(config) {
        animatedActionsheetHeight.setValue(-height);
        state.config = config;
        state.visible = true;
        uiState.hideKeyboard();
        Animated.timing(animatedActionsheetHeight, {
            toValue: 0,
            duration: 300
        }).start();
    }

    @action
    static async hide() {
        if (!state.visible) return;
        await new Promise(resolve =>
            Animated.timing(animatedActionsheetHeight, {
                toValue: -height,
                duration: 300
            }).start(() => {
                // callback when animation is done
                state.visible = false;
                state.config = null;
                resolve();
            })
        );
    }

    static get visible() {
        return state.visible;
    }

    @action.bound
    handleCancel() {
        ActionSheetLayout.hide();
    }

    cancelOption() {
        return (
            <View style={cancelButtonWrapper}>
                <TouchableOpacity style={cancelButtonContainer} onPress={this.handleCancel}>
                    <Text style={boldButtonTextStyle}>{tx('button_cancel')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    renderThrow() {
        if (!state.visible) return null;
        const { actionButtons, hasCancelButton, header } = state.config;
        if (!header && !actionButtons && !hasCancelButton) return null;
        const wrapper = {
            position: 'absolute',
            left: 0,
            bottom: 0,
            right: 0,
            top: 0,
            flexGrow: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: '#00000020',
            zIndex: 15
        };
        const container = {
            paddingBottom: vars.spacing.small.midi2x,
            position: 'absolute',
            bottom: animatedActionsheetHeight
        };
        return (
            <TouchableWithoutFeedback accessible={false} onPress={this.handleCancel}>
                <View style={wrapper}>
                    <Animated.View style={container}>
                        {header}
                        {actionButtons && this.actionButtons()}
                        {hasCancelButton && this.cancelOption()}
                    </Animated.View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
