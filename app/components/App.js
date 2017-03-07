import React, { Component } from 'react';
import { View, PanResponder, Navigator, AppState } from 'react-native';
import { reaction, action, observable } from 'mobx';
import { observer } from 'mobx-react/native';
import Login from './login/login';
import Signup from './signup/signup';
import PersistentFooter from './layout/persistent-footer';
import PopupLayout from './layout/popup-layout';
import BgPattern from './controls/bg-pattern';
// import DebugPanel from './layout/debugPanel';
import LayoutMain from './layout/layout-main';
import state from './layout/state';
import styles, { vars } from './../styles/styles';
// import icebear from '../lib/icebear';
import push from '../lib/push';
import '../lib/sounds';
import './utils/bridge';
import './touchid/touchid-bridge';

@observer
export default class App extends Component {
    constructor(props) {
        super(props);
        state.load();
        this.renderScene = this.renderScene.bind(this);
        this.routes = [
            this.route('loginStart', Login.Wizard, true),
            this.route('loginSaved', Login.Saved),
            this.route('signupStep1', Signup.Step1),
            this.route('signupStep2', Signup.Pin),
            this.route('main', LayoutMain, true)
        ];

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => {
                state.hidePicker();
                return false;
            }
        });

        state.route = state.routesList[0];

        this.bindRouteState = reaction(() => state.route, route => {
            console.log('reaction: %s => %s', state.prevRoute, route);
            const newIndex = state.routesList.indexOf(route);
            const oldIndex = state.routesList.indexOf(state.prevRoute);
            state.prevRoute = route;
            const rInfo = state.routes[route];
            requestAnimationFrame(state.hideKeyboard);
            if (rInfo.replace) {
                this.nav.resetTo(rInfo);
                return;
            }
            if (newIndex === oldIndex - 1) {
                this.nav.pop();
            } else if (newIndex < oldIndex) {
                this.nav.jumpTo(rInfo);
            } else {
                this.nav.push(rInfo);
            }
        });

        if (console._errorOriginal) {
            console.error = console._errorOriginal;
        }

        global.ErrorUtils && global.ErrorUtils.setGlobalHandler((...args) => {
            console.error(`App.js: unhandled error`);
            console.error(args);
        });

        console.stack = [];
        console.stackPush = (i) => {
            const MAX = 1000;
            const index = console.stack.length;
            const delta = index - MAX;
            console.stack.splice(index, delta > 0 ? delta : 0, i);
        };

        const log = console.log;
        console.log = function() {
            log.apply(console, arguments);
            Array.from(arguments).forEach(console.stackPush);
        };

        const error = console.error;
        console.error = function() {
            error.apply(console, arguments);
            Array.from(arguments).forEach(console.stackPush);
        };

        this._handleAppStateChange = this._handleAppStateChange.bind(this);
        this._handleMemoryWarning = this._handleMemoryWarning.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        AppState.addEventListener('memoryWarning', this._handleMemoryWarning);
        // navigating to initial route
        // timeout is needed for router to properly initialize
        if (__DEV__) {
            // setTimeout(() => {
            //     state.routes.signupStep2.transition();
            // }, 1000);
            // migrator.run();
        }
    }

    _handleAppStateChange(appState) {
        console.log(`App.js: AppState change: ${appState}`);
        state.appState = appState;
        if (appState === 'active') {
            push.disableServerSide();
        }
        if (appState === 'background') {
            push.enableServerSide();
        }
    }

    _handleMemoryWarning() {
        console.log(`App.js: AppState memory warning`);
    }

    route(key, component, replace, type) {
        state.routesList.push(key);
        state.routes[key] = {
            index: state.routesList.length - 1,
            replace,
            key,
            type,
            component,
            states: component.states,
            transition: action(() => {
                setTimeout(() => {
                    state.route = key;
                }, 0);
            })
        };
        return state.routes[key];
    }

    renderScene(route) {
        const inner = React.createElement(route.component);
        this.scene = inner;
        const hidden = { overflow: 'hidden' };
        return (
            <View
                testID={`route${route.key}Scene`}
                removeClippedSubviews
                key={route.key}
                style={[styles.navigator.card, hidden]}>
                <BgPattern />
                {inner}
            </View>
        );
    }

    configureScene(route /* , routeStack */) {
        /* if (route.index < 2 || route.index > 3) {
            return Navigator.SceneConfigs.FadeAndroid;
        } */
        return Navigator.SceneConfigs.PushFromRight;
    }

    render() {
        if (!state.locale) return null;
        return (
            <View
                testID="appOuterViewBackground"
                style={{ flex: 1, backgroundColor: vars.bg }}>
                <View
                    testID="navigatorContainer"
                    pointerEvents="auto"
                    style={{ flex: 1, borderWidth: 0, borderColor: 'red' }}>
                    <Navigator
                        testID="navigator"
                        ref={nav => (this.nav = nav)}
                        initialRoute={this.routes[0]}
                        configureScene={(route, routeStack) => this.configureScene(route, routeStack)}
                        renderScene={this.renderScene} />
                    <PersistentFooter />
                </View>
                <PopupLayout />
                {state.picker}
            </View>
        );
    }
}
