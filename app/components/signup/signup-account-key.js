import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View, Clipboard, CameraRoll, TouchableOpacity, Platform } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { observable } from 'mobx';
import ActivityOverlay from '../controls/activity-overlay';
import { vars } from '../../styles/styles';
import { config, getFirstLetterUpperCase } from '../../lib/icebear';
import signupState from './signup-state';
import { t, tx } from '../utils/translator';
import buttons from '../helpers/buttons';
import LoginWizardPage, {
    header, innerSmall, circleTopSmall, title2, row, container
} from '../login/login-wizard-page';
import SignupAvatar from './signup-avatar';
import SignupAvatarActionSheet from './signup-avatar-action-sheet';
import snackbarState from '../snackbars/snackbar-state';
import icons from '../helpers/icons';

const formStyle = {
    padding: 20,
    justifyContent: 'space-between'
};

const addPhotoText = {
    fontSize: 14,
    color: vars.txtMedium,
    textAlign: 'center'
};

const addPhotoPlus = [addPhotoText, {
    fontSize: 30,
    fontWeight: 'bold',
    color: vars.white
}];

const textNormal = {
    color: vars.txtDark,
    fontSize: 16,
    lineHeight: 24
};

const accountKeyText = {
    color: vars.txtDark,
    fontFamily: 'Verdana',
    fontWeight: 'bold',
    fontSize: 18,
    width: 240
};

const accountKeyRow = {
    flexDirection: 'row',
    justifyContent: 'space-between'
};

const smallText = {
    fontSize: 12,
    marginVertical: 8,
    color: vars.txtDark
};

const accountKeyView = {
    marginVertical: 10
};

@observer
export default class SignupStep1 extends LoginWizardPage {
    @observable keySaved = false;
    @observable savingScreenshot = false;

    copyAccountKey() {
        Clipboard.setString(signupState.passphrase);
        snackbarState.pushTemporary(t('title_copied'));
    }

    async saveAccountKey() {
        this.keySaved = true;
        this.savingScreenshot = true;
        let uri = await new Promise(resolve =>
            requestAnimationFrame(async () => {
                const result = await this._viewShot.capture();
                this.savingScreenshot = false;
                resolve(result);
            })
        );
        console.debug(uri);
        // on iOS we can only preview our local data
        (Platform.OS === 'ios') && config.FileStream.launchViewer(uri);
        uri = await CameraRoll.saveToCameraRoll(uri);
        signupState.keyBackedUp = true;
        // on Android we can only preview external data
        // but I am disabling it for now, cause it launches
        // external viewer and it takes more than 1 tap to get
        // back to the app
        // (Platform.OS === 'android') && config.FileStream.launchViewer(uri);
        console.debug(uri);
    }

    get avatarPlaceholder() {
        const letter = getFirstLetterUpperCase(signupState.firstName || signupState.username);
        return (
            <View>
                <Text style={addPhotoPlus}>{letter}</Text>
            </View>
        );
    }

    get body() {
        const { keySaved, savingScreenshot } = this;
        const saveTitle = keySaved ? tx('title_savedToCameraRoll') : tx('button_saveAccountKey');
        return (
            <View>
                <Text style={textNormal}>{t('title_helloName', { name: (signupState.firstName || signupState.username) })}</Text>
                <Text style={textNormal}>{tx('title_accountKey1')}</Text>
                <View style={accountKeyView}>
                    <Text style={smallText}>{tx('title_yourAccountKey')}</Text>
                    <View style={accountKeyRow}>
                        <Text style={accountKeyText} selectable>
                            {signupState.passphrase}
                        </Text>
                        {buttons.uppercaseBlueButton(tx('button_copy'), this.copyAccountKey, false, savingScreenshot)}
                    </View>
                </View>
                <Text style={textNormal}>{tx('title_accountKey2')}</Text>
                <View style={{ width: 240, alignSelf: 'center', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24 }}>
                    {/* buttons.uppercaseBlueBgButton(tx(saveTitle), () => this.saveAccountKey(), keySaved, savingScreenshot) */}
                    {/* signupState.keyBackedUp && icons.plaindark('check-circle') */}
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={container} onLayout={this._layout}>
                <ViewShot ref={ref => { this._viewShot = ref; }}>
                    <View style={header}>
                        {/* TODO: peerio copy */}
                        <Text style={title2}>{tx('title_AccountKey')}</Text>
                    </View>
                    <View>
                        <View style={innerSmall}>
                            <View style={formStyle}>
                                {this.body}
                            </View>
                        </View>
                        <TouchableOpacity
                            onPress={() => this._actionSheet.show()}
                            pressRetentionOffset={vars.pressRetentionOffset}
                            style={[circleTopSmall, { backgroundColor: vars.txtMedium, borderWidth: 0 }]}>
                            {signupState.avatarData ? <SignupAvatar /> : this.avatarPlaceholder}
                        </TouchableOpacity>
                    </View>
                </ViewShot>
                <View style={[row, { justifyContent: 'space-between' }]}>
                    {this.button('button_back', () => signupState.prev())}
                    {this.button(signupState.keyBackedUp ? 'button_finish' : 'button_next', () => signupState.next(), false, !signupState.nextAvailable)}
                </View>
                <SignupAvatarActionSheet ref={sheet => { this._actionSheet = sheet; }} />
                <ActivityOverlay large visible={signupState.isInProgress} />
            </View>
        );
    }
}
