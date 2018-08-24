import { observable, action } from 'mobx';
import { mainState, uiState, loginState } from '../states';
import RoutedState from '../routes/routed-state';
import { User, crypto, saveAccountKeyBackup, config } from '../../lib/icebear';
import { tx } from '../utils/translator';

class SignupState extends RoutedState {
    @observable username = '';
    @observable email = '';
    @observable firstName = '';
    @observable lastName = '';
    @observable passphrase = '';
    @observable pin = '';
    @observable _current = 0;
    get current() { return this._current; }
    set current(i) { uiState.hideAll().then(() => { this._current = i; }); }
    _prefix = 'signup';
    avatarBuffers = null;
    @observable avatarData = null;
    @observable keyBackedUp = false;
    @observable country = '';
    @observable specialty = '';
    @observable role = '';
    @observable medicalId = '';

    get isFirst() { return this.current === 0; }

    transition = () => this.routes.app.signupStep1();

    @action.bound exit() {
        this.username = '';
        this.email = '';
        this.firstName = '';
        this.lastName = '';
        this.pin = '';
        this.medicalId = '';
        this.country = '';
        this.specialty = '';
        this.role = '';
        this.current = 0;
        this.routes.app.loginWelcome();

        // hook for whitelabel signup state to reset itself
        if (this.onExitHandler) this.onExitHandler();
    }

    @action reset() { this.current = 0; }

    generatePassphrase = () => crypto.keys.getRandomAccountKeyHex();

    @action.bound async next() {
        if (!this.passphrase) this.passphrase = await this.generatePassphrase();
        // if (this.keyBackedUp && !User.current) await this.finishAccountCreation(); // TODO tos accepted
        this.current++;
    }

    @action.bound prev() { (this.current > 0) ? this.current-- : this.exit(); }

    @action async finishSignUp() {
        return mainState.activateAndTransition(User.current)
            .catch((e) => {
                console.log(e);
                User.current = null;
                this.reset();
            });
    }

    get backupFileName() {
        return `${this.username}-${tx('title_appName')}.pdf`;
    }

    @action.bound async saveAccountKey() {
        const { username, firstName, lastName, passphrase, backupFileName } = this;
        const fileSavePath = config.FileStream.getTempCachePath(backupFileName);
        await saveAccountKeyBackup(
            fileSavePath,
            `${firstName} ${lastName}`,
            username,
            passphrase
        );
        this.isInProgress = true;
        try {
            await config.FileStream.launchViewer(fileSavePath);
            this.keyBackedUp = true;
        } catch (e) {
            console.error(e);
        }
        this.isInProgress = false;
    }

    // After account is created, user goes to Contact Sync rather than main route
    @action async finishAccountCreation() {
        this.isInProgress = true;
        const user = new User();
        User.current = user;
        const { username, email, firstName, lastName, passphrase, avatarBuffers,
            keyBackedUp, country, specialty, role, medicalId } = this;
        const localeCode = uiState.locale;
        user.username = username;
        user.email = email;
        user.passphrase = __DEV__ && process.env.PEERIO_QUICK_SIGNUP ? 'icebear' : passphrase;
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
        return user.createAccountAndLogin()
            .then(() => loginState.enableAutomaticLogin(user))
            .then(() => mainState.saveUser())
            .then(() => keyBackedUp && User.current.setAccountKeyBackedUp())
            .then(() => avatarBuffers && User.current.saveAvatar(avatarBuffers))
            .finally(() => { this.isInProgress = false; });
    }
}

const signupState = new SignupState();
export default signupState;
