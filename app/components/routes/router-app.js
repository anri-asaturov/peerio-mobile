import { BackHandler } from 'react-native';
import Router from './router';
import SignupWizard from '../signup/signup-wizard';
import LayoutMain from '../layout/layout-main';
import LoginWelcome from '../login/login-welcome';
import LoginWelcomeBack from '../login/login-welcome-back';
import LoginClean from '../login/login-clean';
import PopupState from '../layout/popup-state';
import routes from './routes';
import ActionSheetLayout from '../layout/action-sheet-layout';
import SignupCancel from '../signup/signup-cancel';

class RouterApp extends Router {
    constructor() {
        super();
        routes.app = this;
        this.add('loginWelcome', LoginWelcome);
        this.add('loginWelcomeBack', LoginWelcomeBack);
        this.add('loginClean', LoginClean);
        this.add('signupStep1', SignupWizard);
        this.add('signupCancel', SignupCancel);
        this.add('main', LayoutMain, true);

        const layoutMainTransition = this.main;
        this.main = async () => {
            await routes.main.initialize();
            layoutMainTransition();
            routes.main.initialRoute();
        };

        BackHandler.addEventListener('hardwareBackPress', () => {
            if (ActionSheetLayout.visible) {
                ActionSheetLayout.hide();
                return true;
            }
            let blockingPopup = true;
            if (PopupState.activePopup) {
                blockingPopup =
                    PopupState.activePopup.type === 'systemWarning' ||
                    PopupState.activePopup.type === 'systemUpgrade';
            }
            if (!blockingPopup) {
                PopupState.discardPopup();
                return true;
            }
            if (routes.modal.route) {
                routes.modal.discard();
                return true;
            }
            // go back from signupStep1
            if (this.route === 'signupStep1' || this.route === 'loginClean') {
                this.loginWelcome();
                return true;
            }
            // allow to back from main state when index is 0
            if (this.route === 'main') {
                return routes.main.androidBackHandler();
            }
            return false;
        });
    }
}

export default new RouterApp();
