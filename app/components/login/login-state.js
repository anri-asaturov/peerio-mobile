import { when, observable, action, reaction } from 'mobx';
import RNRestart from 'react-native-restart';
import mainState from '../main/main-state';
import settingsState from '../settings/settings-state';
import {
    User,
    fileStore,
    socket,
    TinyDb,
    warnings,
    overrideServer,
    clientApp
} from '../../lib/icebear';
import keychain from '../../lib/keychain-bridge';
import { rnAlertYesNo } from '../../lib/alerts';
import { popupSignOutAutologin } from '../shared/popups';
import { tx } from '../utils/translator';
import RoutedState from '../routes/routed-state';
import routes from '../routes/routes';
import tm from '../../telemetry';
import { promiseWhen } from '../helpers/sugar';

const loginConfiguredKey = 'loginConfigured';

class LoginState extends RoutedState {
    @observable username = '';
    @observable firstName = '';
    @observable lastName = '';
    @observable passphrase = '';
    @observable passphraseValidationMessage = null;
    @observable changeUser = false;
    @observable current = 0;
    @observable selectedAutomatic = null;
    @observable loaded = false;
    @observable tfaRequested = false;
    // this is the loading screen flag that gets displayed
    // for the returning user
    @observable showLoadingScreen = false;
    _prefix = 'login';

    constructor() {
        super();
        reaction(
            () => this.passphrase,
            () => {
                this.passphraseValidationMessage = null;
            }
        );
    }

    @action
    async enableAutomaticLogin(user) {
        user.autologinEnabled = true;
        const key = `${user.username}::${loginConfiguredKey}`;
        await TinyDb.system.setValue(key, user.autologinEnabled);
    }

    @action
    changeUserAction() {
        if (this.isInProgress) return;
        this.changeUser = true;
        this.clean();
        this.routes.app.loginWelcome();
    }

    @action.bound
    async switchUser() {
        await User.removeLastAuthenticated();
        this.clean();
        this.routes.app.loginClean();
    }

    @action.bound
    async clearLastUser() {
        await User.removeLastAuthenticated();
        this.clean();
        this.routes.app.loginWelcome();
    }

    @action
    clean() {
        this.current = 0;
        this.username = '';
        this.passphrase = '';
        this.passphraseValidationMessage = '';
        this.isInProgress = false;
    }

    async _login(user) {
        User.current = user;
        try {
            await user.login();
            console.log('login-state.js: logged in');
            await routes.app.main();
            await this.enableAutomaticLogin(user);
            tm.login.onUserLogin(user.autologinEnabled, this.tfaRequested);
        } catch (e) {
            const error = new Error(e);
            const { deleted, blacklisted } = User.current;
            Object.assign(error, { deleted, blacklisted });
            User.current = null;
            if (user.deleted) {
                console.error('server returned that user has been deleted');
                this.passphraseValidationMessage = tx('title_accountDeleted');
                warnings.addSevere('title_accountDeleted', 'title_accountDeleted');
            }
            if (user.blacklisted) {
                console.error('server returned that user has been suspended');
                this.passphraseValidationMessage = tx('error_accountSuspendedTitle');
                warnings.addSevere('error_accountSuspendedText', 'error_accountSuspendedTitle');
            }
            if (clientApp.clientVersionDeprecated) {
                console.error('server says client is deprecated');
                this.passphraseValidationMessage = '';
                warnings.addSevere('warning_deprecated');
                error.clientVersionDeprecated = true;
            }
            // error is caught by login-inputs to provide feedback on login
            throw error;
        } finally {
            this.isInProgress = false;
        }
    }

    // Manual Login
    @action
    login = async () => {
        const user = new User();
        user.username = this.username;
        user.passphrase = this.passphrase.trim();
        this.isInProgress = true;
        await promiseWhen(() => socket.connected);
        await this._login(user);
        await mainState.saveUser();
    };

    // Automatic Login
    @action
    loginCached = async data => {
        const user = new User();
        user.deserializeAuthData(data);
        this.isInProgress = true;
        user.autologinEnabled = true;
        await promiseWhen(() => socket.connected);
        await this._login(user);
    };

    async restart() {
        await RNRestart.Restart();
    }

    async signOut(force) {
        const inProgress = !!fileStore.files.filter(f => f.downloading || f.uploading).length;
        (await !force) && inProgress
            ? rnAlertYesNo(tx('dialog_confirmLogOutDuringTransfer'))
            : Promise.resolve(true);
        let untrust = false;
        if (!force && User.current.autologinEnabled) {
            const popupResult = await popupSignOutAutologin();
            if (!popupResult) {
                routes.main.settings();
                settingsState.transition('security');
                return;
            }
            untrust = popupResult.checked;
        }
        const { username } = User.current;
        overrideServer(null);
        await TinyDb.system.removeValue(`apple-review-login`);
        await TinyDb.system.removeValue(`${username}::${loginConfiguredKey}`);
        await TinyDb.system.removeValue(`user::${username}::touchid`);
        await TinyDb.system.removeValue(`user::${username}::keychain`);
        await TinyDb.system.removeValue(`${username}::skipTouchID`);
        try {
            await keychain.delete(await mainState.getKeychainKey());
        } catch (e) {
            console.log(e);
        }
        await User.current.signout(untrust);
        await RNRestart.Restart();
    }

    // Returns true if a we have existing user data AND that user is not currently logged in
    async haveLoggedOutUser() {
        const userData = await User.getLastAuthenticated();
        if (!userData) return false;
        const { username } = userData;
        if (await TinyDb.system.getValue(`user::${username}::keychain`)) return false;
        return true;
    }

    async load() {
        console.log(`login-state.js: loading`);
        setTimeout(() => {
            this.isInProgress = false;
        }, 0);
        const load = async () => {
            await new Promise(resolve => when(() => socket.connected, resolve));
            const userData = await User.getLastAuthenticated();
            if (!userData) return;
            const { username /* , firstName, lastName */ } = userData;
            if (this.username && this.username !== username) return;
            this.username = username;
            if (username) {
                this.loaded = await this.loadFromKeychain();
            }
        };
        // TODO: fix this android hack for LayoutAnimation easeInEaseOut on transitions
        setTimeout(() => {
            this.isInProgress = true;
        }, 0);
        try {
            await load();
        } catch (e) {
            console.error(e);
        }
        // TODO: fix this android hack for LayoutAnimation easeInEaseOut on transitions
        setTimeout(() => {
            this.isInProgress = false;
        }, 0);
    }

    @action
    async loadFromKeychain() {
        await keychain.load();
        if (!keychain.hasPlugin) return false;
        const keychainKey = await mainState.getKeychainKey(this.username);
        let data = await keychain.get(keychainKey);
        if (!data) {
            console.log(`reading keychain failed`);
            await new Promise(resolve => when(() => clientApp.isFocused, resolve));
            console.log(`app is in foreground, trying again`);
            data = await keychain.get(keychainKey);
            if (!data) {
                return false;
            }
        }
        try {
            const touchIdKey = `user::${this.username}::touchid`;
            const secureWithTouchID = !!(await TinyDb.system.getValue(touchIdKey));
            data = JSON.parse(data);
            await this.loginCached(data);
            User.current.secureWithTouchID = secureWithTouchID;
            // Temporary: if passphrase was stored unpadded,
            // resave user data, so that it's padded.
            if (!data.paddedPassphrase) {
                console.log('login-state.js: resaving data with padding');
                await mainState.saveUserKeychain(secureWithTouchID);
            }
            return true;
        } catch (e) {
            console.log('login-state.js: logging in with keychain failed');
        }
        return false;
    }
}

const loginState = new LoginState();

export default loginState;
