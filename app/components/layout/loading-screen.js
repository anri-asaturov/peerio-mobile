import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, action, computed } from 'mobx';
import LottieView from 'lottie-react-native';
import { vars } from '../../styles/styles';
import loginState from '../login/login-state';
import routes from '../routes/routes';
import { socket } from '../../lib/icebear';
import { promiseWhen } from '../helpers/sugar';
import { tx } from '../utils/translator';
import SnackBarConnection from '../snackbars/snackbar-connection';

const logoHeight = 72; // Logo in the animation
const logoAnimation = require('../../assets/loading_screens/loading-screen-logo-animation.json');
const revealAnimation = require('../../assets/loading_screens/loading-screen-reveal-animation.json');

@observer
export default class LoadingScreen extends Component {
    @observable authenticated = false;
    @observable logoAnimVisible = true;
    @observable statusTextVisible = true;
    @observable revealAnimVisible = false;

    statusTextOpacity = new Animated.Value(1);
    containerOpacity = new Animated.Value(1);

    async componentDidMount() {
        try {
            await loginState.load();
            if (!loginState.loaded) throw new Error('error logging in after return');
            await promiseWhen(() => socket.authenticated);
            this.authenticated = true;
            await promiseWhen(() => routes.main.chatStateLoaded);
            await promiseWhen(() => routes.main.fileStateLoaded);
            // TODO: this actually causes a 1000 ms delay in rendering the app
            // there should be a better way to handle this transition
            this.animateReveal();
        } catch (e) {
            console.log('loading-screen.js: loading screen error');
            if (!loginState.loaded) routes.app.loginWelcomeBack();
            console.error(e);
            this.dismiss();
        }
    }

    @action.bound
    animateReveal() {
        this.revealAnimVisible = true;
        this.logoAnimVisible = false;

        Animated.timing(this.statusTextOpacity, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true
        }).start();

        // TODO: this actually causes a 1000 ms delay in rendering the app
        // there should be a better way to handle this transition
        setTimeout(() => {
            Animated.timing(this.containerOpacity, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true
            }).start(this.dismiss);
        }, 1000);
    }

    @computed
    get statusText() {
        if (!socket.connected) return tx('title_waitingToConnect');
        if (!this.authenticated) return tx('title_authenticating');
        return tx('title_decrypting');
    }

    dismiss() {
        loginState.showLoadingScreen = false;
    }

    render() {
        if (!loginState.showLoadingScreen) return null;
        const container = {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            opacity: this.containerOpacity
        };
        const loadingProgressContainer = {
            position: 'absolute',
            top: '50%',
            marginTop: vars.spacing.medium.maxi2x + logoHeight / 2
        };
        const animationContainer = {
            alignSelf: 'stretch', // this is for android throwing errors
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        };
        const statusTextStyle = {
            marginStart: vars.spacing.small.mini2x,
            fontSize: vars.font.size18,
            color: vars.white,
            textAlign: 'center',
            opacity: this.statusTextOpacity
        };
        return (
            <Animated.View style={container}>
                {this.revealAnimVisible && (
                    <LottieView
                        autoPlay
                        loop={false}
                        style={[animationContainer, { backgroundColor: vars.darkBlue }]}
                        source={revealAnimation}
                        resizeMode="cover"
                    />
                )}
                {this.logoAnimVisible && (
                    <LottieView
                        autoPlay
                        loop
                        style={[animationContainer, { backgroundColor: vars.darkBlueBackground05 }]}
                        source={logoAnimation}
                        resizeMode="cover"
                    />
                )}
                <View style={loadingProgressContainer}>
                    <Animated.Text style={statusTextStyle}>{this.statusText}</Animated.Text>
                </View>
                <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
                    <SnackBarConnection />
                </View>
            </Animated.View>
        );
    }
}
