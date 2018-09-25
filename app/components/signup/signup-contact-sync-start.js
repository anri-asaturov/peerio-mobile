import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Image } from 'react-native';
import { action } from 'mobx';
import Text from '../controls/custom-text';
import { tx } from '../utils/translator';
import buttons from '../helpers/buttons';
import contactState from '../contacts/contact-state';
import signupState from './signup-state';
import { formStyle, titleDark, textNormal } from '../../styles/contact-sync';
import { popupContactPermission } from '../shared/popups';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';

const imageDiscoverNetwork = require('../../assets/discover-network.png');

@observer
export default class SignupContactSyncStart extends SafeComponent {
    get icon() {
        const width = vars.topCircleSizeSmall * 2;
        const height = width;
        return (
            <View style={[vars.circleTopSmall, { borderWidth: 0 }]}>
                <Image
                    source={imageDiscoverNetwork}
                    style={{ width, height }} />
            </View>
        );
    }

    @action.bound async syncContacts() {
        const hasPermissions =
            await popupContactPermission(tx('title_permissionContacts'), tx('title_permissionContactsDescroption'))
            && await contactState.hasPermissions();
        if (hasPermissions) {
            // user has chosen to auto import contacts
            contactState.importContactsInBackground = true;
            signupState.next();
        } else {
            // user has not given permission to access contacts
            contactState.importContactsInBackground = false;
            signupState.finishSignUp();
        }
    }

    render() {
        return (
            <View onLayout={this._layout}>
                <View>
                    <Text semibold>{tx('title_discoverNetwork')}</Text>
                </View>
                <View style={{ flex: 0.7, flexGrow: 1 }}>
                    <View>
                        <View style={formStyle}>
                            <Text semibold style={titleDark}>{tx('title_findYourContacts')}</Text>
                            <Text style={textNormal}>{tx('title_findYourContactsDescription')} </Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                            {buttons.roundBlueBgButton(tx('button_syncContacts'), () => this.syncContacts())}
                        </View>
                    </View>
                    {this.icon}
                </View>
                <View style={{ flexDirection: 'row', height: 90, justifyContent: 'flex-end' }}>
                    {this.button('button_skip', () => signupState.finishSignUp())}
                </View>
            </View>
        );
    }
}
