import randomWords from 'random-words';
import capitalize from 'capitalize';
import { observable, action, when } from 'mobx';
import { mainState, uiState, loginState } from '../states';
import RoutedState from '../routes/routed-state';
import { User, socket, crypto } from '../../lib/icebear';

class SignupState extends RoutedState {
    SAVE_PIN_SCREEN_NUMBER = 1;
    KEY_BACKED_SCREEN = 2;

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
            case this.SAVE_PIN_SCREEN_NUMBER: return socket.connected;
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
        this.current = 0;
        this.resetValidationState();
        this.routes.app.loginStart();
    };

    @action reset() { this.current = 0; }

    generatePassphrase = () => crypto.keys.getRandomAccountKeyHex();

    @action async next() {
        if (!this.passphrase) this.passphrase = await this.generatePassphrase();
        if (this.keyBackedUp && (this.current === this.KEY_BACKED_SCREEN)) await this.finishAccountCreation();
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
        const { username, email, firstName, lastName, passphrase, avatarBuffers, keyBackedUp } = this;
        const localeCode = uiState.locale;
        user.username = username;
        user.email = email;
        user.passphrase = __DEV__ && process.env.PEERIO_QUICK_SIGNUP ? 'icebear' : passphrase;
        user.firstName = firstName;
        user.lastName = lastName;
        user.localeCode = localeCode;
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
