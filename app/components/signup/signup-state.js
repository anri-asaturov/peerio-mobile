import randomWords from 'random-words';
import capitalize from 'capitalize';
import { observable, action, when } from 'mobx';
import { mainState, uiState, loginState } from '../states';
import RoutedState from '../routes/routed-state';
import { User, socket, crypto } from '../../lib/icebear';
import WhiteLabel from '../whitelabel/white-label-components';

class SignupState extends RoutedState {
    @observable username = '';
    @observable email = '';
    @observable firstName = '';
    @observable lastName = '';
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

    get nextAvailable() {
        switch (this.current) {
            case WhiteLabel.SAVE_PIN_SCREEN_NUMBER: return socket.connected;
            default: return false;
        }
    }

    get isFirst() { return this.current === 0; }

    transition = () => this.routes.app.signupStep1();

    exit = () => {
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
        uiState.countrySelected = uiState.defaultCountrySelected;
        uiState.specialtySelected = '';
        uiState.roleSelected = '';
        this.resetValidationState();
        this.routes.app.loginStart();
    };

    @action reset() { this.current = 0; }

    generatePassphrase = () => crypto.keys.getRandomAccountKeyHex();

    @action async next() {
        if (!this.passphrase) this.passphrase = await this.generatePassphrase();
        if (this.keyBackedUp && (this.current === WhiteLabel.KEY_BACKED_SCREEN_NUMBER)) await this.finishAccountCreation();
        this.current++;
    }

    @action prev() { (this.current > 0) ? this.current-- : this.exit(); }

    @action async finishSignUp() {
        return mainState.activateAndTransition(User.current)
            .catch((e) => {
                console.log(e);
                User.current = null;
                this.reset();
            });
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
            user.props = {
                country,
                specialty,
                role,
                medicalId
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

if (__DEV__ && process.env.PEERIO_QUICK_SIGNUP) {
    when(() => !process.env.PEERIO_AUTOLOGIN && signupState.isConnected && signupState.isActive, () => {
        const s = signupState;
        const rnd = new Date().getTime();
        s.username = randomWords({ min: 2, max: 2, join: 'o' }).substring(0, 16);
        s.email = `seavan+${rnd}@gmail.com`;
        s.firstName = capitalize(randomWords());
        s.lastName = capitalize(randomWords());
        s.keyBackedUp = true;
    });
}

export default signupState;
