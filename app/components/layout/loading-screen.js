import React, { Component } from 'react';
import { View, Animated, LayoutAnimation } from 'react-native';
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
    @observable authenticated = false;
    @observable logoAnimVisible = true;
    @observable statusTextVisible = true;
    @observable revealAnimVisible = false;

    logoAnimValue = new Animated.Value(0);

    async componentDidMount() {
        try {
            this.animateLogo();
            await loginState.load();
            if (!loginState.loaded) throw new Error('error logging in after return');
            await promiseWhen(() => socket.authenticated);

            this.authenticated = true; // Changes status text

            await promiseWhen(() => routes.main.chatStateLoaded);
            await promiseWhen(() => routes.main.fileStateLoaded);
            await promiseWhen(() => routes.main.contactStateLoaded);

            this.animateReveal();
        } catch (e) {
            console.log('loading-screen.js: loading screen error');
            if (!loginState.loaded) routes.app.routes.loginWelcomeBack.transition();
            console.error(e);
        }
    }

    @action.bound animateLogo() {
        this.logoAnimValue.setValue(0);
        Animated.timing(this.logoAnimValue, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true
        }).start(() => {
            if (this.logoAnimVisible) this.animateLogo();
        });
    }

    @action.bound animateReveal() {
        this.revealAnimVisible = true;
        this.logoAnimVisible = false;
        LayoutAnimation.easeInEaseOut();
        this.statusTextVisible = false;
        this.revealAnimValue = new Animated.Value(0);
        Animated.timing(this.revealAnimValue, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true
        }).start(() => {
            this.wireframeAnimValue = false;
            routerMain.tranisitionToMain();
        });
    }

    @computed get statusText() {
        if (!socket.connected) return tx('title_waitingToConnect');
        if (this.authenticated) return tx('title_decrypting'); // TODO change copy
        return tx('title_connecting');
    }

    render() {
        const container = {
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
        const animationContainer = {
            alignSelf: 'stretch', // this is for android throwing errors
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        };
        const statusTextStyle = {
            fontSize: vars.font.size18,
            color: vars.white,
            textAlign: 'center'
        };
        return (
            <View style={container}>
                {this.revealAnimVisible && <LottieView
                    progress={this.revealAnimValue}
                    style={[animationContainer, { backgroundColor: vars.darkBlue }]}
                    source={revealAnimation}
                    resizeMode="cover"
                />}
                {this.logoAnimVisible && <LottieView
                    progress={this.logoAnimValue}
                    style={[animationContainer, { backgroundColor: vars.darkBlueBackground05 }]}
                    source={logoAnimation}
                    resizeMode="cover"
                />}
                {this.statusTextVisible && <View style={loadingProgressContainer}>
                    <Text style={statusTextStyle}>
                        {this.statusText}
                    </Text>
                </View>}
                <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
                    <SnackBarConnection />
                </View>
            </View>
        );
    }
}
