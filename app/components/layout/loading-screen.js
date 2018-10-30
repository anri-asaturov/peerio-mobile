import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, action, computed } from 'mobx';
import LottieView from 'lottie-react-native';
import Text from '../controls/custom-text';
import { vars } from '../../styles/styles';
import loginState from '../login/login-state';
import routes from '../routes/routes';
import { socket } from '../../lib/icebear';
import { promiseWhen } from '../helpers/sugar';
import { tx } from '../utils/translator';
import SnackBarConnection from '../snackbars/snackbar-connection';
import routerMain from '../routes/router-main';

const logoAnimation = require('../../assets/loading_screens/loading-screen-logo-animation.json');
const revealAnimation = require('../../assets/loading_screens/loading-screen-reveal-animation.json');

@observer
export default class LoadingScreen extends Component {
    @observable loadingStep = 0;
    @observable randomMessage;

    async componentDidMount() {
        this.animateLogo();

        try {
            await loginState.load();
            if (!loginState.loaded) throw new Error('error logging in after return');
            this.goToNextStep();
            await promiseWhen(() => socket.authenticated);
            this.goToNextStep();
            await promiseWhen(() => routes.main.chatStateLoaded);
            this.goToNextStep();
            await promiseWhen(() => routes.main.fileStateLoaded);
            this.goToNextStep();
            await promiseWhen(() => routes.main.contactStateLoaded);
        } catch (e) {
            console.log('loading-screen.js: loading screen error');
            if (!loginState.loaded) routes.app.routes.loginWelcomeBack.transition();
            console.error(e);
        }
    }

    @action.bound animateLogo() {
        this.lottieValue = new Animated.Value(0);
        Animated.timing(this.lottieValue, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true
        }).start(() => {
            console.log('LOGO ANIMATION');
            if (loginState.loading) this.animateLogo();
            else this.animateReveal();
        });
    }

    @action.bound animateReveal() {
        routerMain.tranisitionToMain();
    }

    @action.bound goToNextStep() {
        ++this.loadingStep;
    }

    @computed get statusText() {
        if (!socket.connected) return tx('title_waitingToConnect');
        return tx(this.icons[this.loadingStep]);
    }

    render() {
        const container = {
            backgroundColor: vars.darkBlue,
            flex: 1,
            flexGrow: 1,
            alignItems: 'center'
        };
        const loadingProgressContainer = {
            flex: 1,
            flexGrow: 1,
            justifyContent: 'flex-end',
            marginBottom: vars.loadingScreenMarginBottom
        };
        const style = {
            alignSelf: 'stretch', // this is for android throwing errors
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        };
        const statusTextStyle = {
            marginTop: vars.spacing.medium.midi2x,
            fontSize: vars.font.size18,
            color: vars.white,
            textAlign: 'center'
        };
        return (
            <View style={container}>
                <LottieView
                    progress={this.lottieValue}
                    style={style}
                    source={logoAnimation}
                    autoPlay={false}
                    loop
                />
                <View style={loadingProgressContainer}>
                    <Text style={statusTextStyle}>
                        {this.statusText}
                    </Text>
                </View>
                <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
                    <SnackBarConnection />
                </View>
            </View>
        );
    }

    icons = [
        'title_connecting',
        'title_authenticating',
        'title_decrypting',
        'title_confirming',
        'title_done'
    ];
}
