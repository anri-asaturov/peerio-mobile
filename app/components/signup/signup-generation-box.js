import React from 'react';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import { View, Platform, Animated, LayoutAnimation } from 'react-native';
import LottieView from 'lottie-react-native';
import { vars } from '../../styles/styles';
import SafeComponent from '../shared/safe-component';
import signupState from './signup-state';
import Text from '../controls/custom-text';

const accountKeyStyle = {
    height: Platform.OS === 'ios' ? vars.font.size.smaller : null,
    alignSelf: 'stretch',
    textAlign: 'center',
    fontSize: vars.font.size.smaller,
    color: '#E90162',
    letterSpacing: Platform.OS === 'android' ? 3 : 0
};

const dottedBoxStyle = {
    alignSelf: 'stretch',
    height: 44,
    borderColor: vars.mediumGrayBg,
    borderWidth: 2,
    borderStyle: 'dotted',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
};

@observer
export default class SignupGenerationBox extends SafeComponent {
    @observable animationFinished = false;

    get isAnimated() {
        return this.props.animated && !this.animationFinished;
    }

    lottieValue = new Animated.Value(0);

    componentDidMount() {
        this.props.animated &&
            Animated.timing(this.lottieValue, {
                toValue: 1,
                duration: __DEV__ ? 500 : 8000,
                useNativeDriver: true
            }).start(() => {
                this.animationFinished = true;
                LayoutAnimation.easeInEaseOut();
                setTimeout(this.props.onAnimationFinished, 1000);
            });
    }

    get animation() {
        // this is for android throwing errors
        const dummyStyle = {
            alignSelf: 'stretch'
        };
        return (
            <LottieView
                progress={this.lottieValue}
                style={dummyStyle}
                resizeMode="cover"
                source={require('../../assets/loader-ak.json')}
                autoPlay={false}
                loop={false}
            />
        );
    }

    get text() {
        return (
            <Text
                numberofLines={1}
                minimumFontScale={0.1}
                adjustsFontSizeToFit
                monospace
                semibold
                style={accountKeyStyle}>
                {signupState.passphrase}
            </Text>
        );
    }

    renderThrow() {
        const { marginBottom } = this.props;
        return (
            <View
                style={[
                    dottedBoxStyle,
                    {
                        marginBottom: marginBottom ? 24 : 0
                    }
                ]}>
                {this.isAnimated ? this.animation : this.text}
            </View>
        );
    }
}
