import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, Image, Dimensions } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';
import testLabel from '../helpers/test-label';
import ViewWithDrawer from '../shared/view-with-drawer';
import { uiState } from '../states';
import routes from '../routes/routes';
import preferenceStore from '../settings/preference-store';
import SyncContactsButton from '../shared/sync-contacts-button';

const zeroStateImage = require('../../assets/zero_chat_state/zero-state.png');

const container = {
    backgroundColor: vars.darkBlueBackground05,
    flex: 1
};

const textStyle = {
    color: vars.textBlack87,
    textAlign: 'center',
    paddingHorizontal: vars.spacing.large.mini,
    paddingVertical: vars.spacing.small.mini
};

const chatHeaderStyle = {
    fontSize: vars.font.size.huge,
    paddingTop: vars.spacing.medium.maxi2x,
    paddingHorizontal: vars.spacing.large.maxi
};

const chatDescriptionStyle = {
    fontSize: vars.font.size.normal,
    marginVertical: vars.spacing.medium.mini,
    paddingHorizontal: vars.spacing.large.maxi
};

const imageStyle = {
    width: Dimensions.get('window').width,
    height: 255,
    paddingHorizontal: vars.spacing.medium.midi2x,
    marginTop: vars.spacing.medium.midi,
    marginBottom: vars.spacing.large.maxi2x
};

@observer
export default class ChatZeroStatePlaceholder extends SafeComponent {
    @action.bound
    sync() {
        uiState.isFirstLogin = false;
        routes.modal.contactSync();
    }

    get moreDetails() {
        return (
            <View>
                <Text style={textStyle}>
                    {tx('title_createRooms')}
                </Text>
                <Text style={textStyle}>
                    {tx('title_createDMs')}
                </Text>
            </View>
        );
    }

    renderThrow() {
        return (
            <View style={container}>
                <ViewWithDrawer>
                    <Text bold style={[textStyle, chatHeaderStyle]} {...testLabel('title_headerZeroState')}>
                        {tx('title_zeroChat')}
                    </Text>
                    <Text style={[textStyle, chatDescriptionStyle]}>
                        {tx('title_zeroChatsDescription')}
                    </Text>
                    <Image
                        source={zeroStateImage}
                        resizeMode="contain"
                        style={imageStyle} />
                    {preferenceStore.prefs.importContactsInBackground ?
                        this.moreDetails : <SyncContactsButton />}
                </ViewWithDrawer>
            </View>
        );
    }
}
