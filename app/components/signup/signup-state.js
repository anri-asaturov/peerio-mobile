import RNShare from 'react-native-share';
import RNFS from 'react-native-fs';
import FileOpener from 'react-native-file-opener';
import { Platform } from 'react-native';
import { observable, action } from 'mobx';
import { mainState, uiState, loginState } from '../states';
import RoutedState from '../routes/routed-state';
import {
    User,
    crypto,
    saveAccountKeyBackup,
    config,
    validation,
    telemetry
} from '../../lib/icebear';
import { tx } from '../utils/translator';
import { when } from '../../../node_modules/mobx/lib/mobx';
import tm from '../../telemetry';

const { S } = telemetry;

const { validators } = validation;
const { suggestUsername } = validators;

class SignupState extends RoutedState {
    @observable username = '';
    @observable email = '';
    @observable firstName = '';
    @observable lastName = '';
    @observable passphrase = '';
    @observable pin = '';
    @observable _current = 0;
    get current() {
        return this._current;
    }
    set current(i) {
        uiState.hideAll().then(() => {
            this._current = i;
        });
    }
    _prefix = 'signup';
    avatarBuffers = null;
    @observable avatarData = null;
    @observable keyBackedUp = false;
    @observable country = '';
    @observable specialty = '';
    @observable role = '';
    @observable medicalId = '';
    @observable usernameSuggestions = [];
    @observable subscribeToPromoEmails = false;
    @observable isPdfPreviewVisible = false;

    get isFirst() {
        return this.current === 0;
    }

    transition = () => this.routes.app.signupStep1();

    @action.bound
    exit() {
        this.username = '';
        this.email = '';
        this.firstName = '';
        this.lastName = '';
        this.pin = '';
        this.medicalId = '';
        this.country = '';
        this.specialty = '';
        this.role = '';
        this.keyBackedUp = false;
        this.current = 0;
        this.usernameSuggestions.clear();
        this.routes.app.loginWelcome();

        // hook for whitelabel signup state to reset itself
        if (this.onExitHandler) this.onExitHandler();
    }

    @action
    reset() {
        this.current = 0;
    }

    generatePassphrase = () => crypto.keys.getRandomAccountKeyHex();

    @action.bound
    async next() {
        if (!this.passphrase) this.passphrase = await this.generatePassphrase();
        this.current++;
    }

    @action.bound
    prev() {
        this.current > 0 ? this.current-- : this.exit();
    }

    @action.bound
    async suggestUsernames() {
        try {
            this.usernameSuggestions = await suggestUsername(
                this.firstName,
                this.lastName
            );
        } catch (e) {
            console.error(e);
        }
    }

    @action
    async finishSignUp() {
        return mainState.activateAndTransition(User.current).catch(e => {
            console.log(e);
            User.current = null;
            this.reset();
        });
    }

    backupFileName = ext => {
        return `${this.username}-${tx('title_appName')}.${ext}`;
    };

    @action.bound
    async saveAccountKey() {
        const {
            username,
            firstName,
            lastName,
            passphrase,
            backupFileName
        } = this;
        let fileSavePath = config.FileStream.getTempCachePath(backupFileName('pdf'));
        await saveAccountKeyBackup(
            fileSavePath,
            `${firstName} ${lastName}`,
            username,
            passphrase
        );
        this.isInProgress = true;
        this.isPdfPreviewVisible = true;
        try {
            const viewer = config.FileStream.launchViewer(fileSavePath);
            if (Platform.OS !== 'android') RNShare.open({ type: 'text/pdf', url: fileSavePath });
            try {
                await viewer;
            } catch (e) { // No PDF reader installed on Android, or if viewer failed for any other reason
                console.error(e);
                fileSavePath = config.FileStream.getTempCachePath(backupFileName('txt'));
                const content = `${tx('title_appName')} Username: ${username}\n${tx('title_appName')} Account Key: ${passphrase}`;

                await RNFS.writeFile(fileSavePath, content, 'utf8');
                await FileOpener.open(fileSavePath, 'text/*', fileSavePath);
                tm.signup.confirmSaveAk(S.TXT);
            }
            this.keyBackedUp = true;
        } catch (e) {
            console.error(e);
        }
        this.isInProgress = false;
        this.isPdfPreviewVisible = false;
    }

    @action
    async finishAccountCreation() {
        this.isInProgress = true;
        const user = new User();
        User.current = user;
        const {
            username,
            email,
            firstName,
            lastName,
            passphrase,
            avatarBuffers,
            keyBackedUp,
            subscribeToPromoEmails,
            country,
            specialty,
            role,
            medicalId
        } = this;
        const localeCode = uiState.locale;
        user.username = username;
        user.email = email;
        user.passphrase =
            __DEV__ && process.env.PEERIO_QUICK_SIGNUP ? 'icebear' : passphrase;
        user.firstName = firstName;
        user.lastName = lastName;
        user.localeCode = localeCode;
        if (process.env.APP_LABEL === 'medcryptor') {
            let medicalRole = role;
            if (role === 'admin' && country === 'AU') {
                medicalRole = `${role}:${medicalId}`;
            }
            user.props = {
                mcrCountry: country,
                mcrSpecialty: specialty,
                mcrRoles: [medicalRole],
                mcrAHPRA: medicalId
            };
        }
        return user
            .createAccountAndLogin()
            .then(() => loginState.enableAutomaticLogin(user))
            .then(() => mainState.saveUser())
            .then(() => keyBackedUp && User.current.setAccountKeyBackedUp())
            .then(() => avatarBuffers && User.current.saveAvatar(avatarBuffers))
            .then(() => {
                // TODO: replace with icebear version after it's merged
                const { settings } = User.current;
                when(
                    () => !settings.loading,
                    () => {
                        settings.subscribeToPromoEmails = subscribeToPromoEmails;
                        User.current.saveSettings();
                    }
                );
            })
            .finally(() => {
                this.isInProgress = false;
            });
    }
}

const signupState = new SignupState();
global.signupState = signupState;
export default signupState;
