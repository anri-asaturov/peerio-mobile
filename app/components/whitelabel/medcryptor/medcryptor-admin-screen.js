import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { observer } from 'mobx-react/native';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import { t, tu } from 'peerio-translator';
import Text from '../../controls/custom-text';
import SafeComponent from '../../shared/safe-component';
import { vars } from '../../../styles/styles';
import routes from '../../routes/routes';
import icons from '../../helpers/icons';
import chatState from '../../messaging/chat-state';
import { uiState } from '../../states';
import { contactStore } from '../../../lib/icebear';
import BlueRoundButton from '../../buttons/blue-round-button';

const container = {
    flex: 1,
    flexGrow: 1
};

const wrapper = {
    flex: 1,
    flexGrow: 1,
    alignItems: 'center'
};

const welcomeContainerStyle = {
    alignItems: 'center',
    margin: vars.spacing.large.midi,
    marginTop: vars.spacing.large.mini2x
};

const welcomeHeaderStyle = {
    color: vars.textBlack87,
    fontSize: vars.font.size20,
    fontWeight: 'bold'
};

const upgradeDescriptionStyle = {
    color: vars.textBlack87,
    fontSize: vars.font.size16,
    marginBottom: vars.spacing.large.mini
};

const featureContainerStyle = {
    width: '80%',
    marginBottom: vars.spacing.large.mini2x
};

const featureContainer = {
    display: 'flex',
    flexDirection: 'row'
};

const featureStyle = {
    color: vars.textBlack54,
    fontSize: vars.font.size16,
    marginBottom: vars.spacing.small.midi2x
};

const featureIcon = {
    padding: vars.spacing.small.mini,
    marginRight: vars.spacing.small.maxi2x
};

const buttonContainerStyle = {
    paddingVertical: vars.spacing.medium.midi
};

const buttonStyle = {
    color: vars.textBlack38
};

@observer
export default class MedcryptorAdminScreen extends SafeComponent {
    constructor(props) {
        super(props);
        this.helpAccount = contactStore.getContact(this.helpAccountUsername);
    }

    componentWillMount() {
        uiState.hideTabs = true;
    }

    componentWillUnmount() {
        uiState.hideTabs = false;
    }

    helpAccountUsername = 'team_medcryptor';
    buyAccountUrl = 'https://medcryptor.com/';
    features = [
        'mcr_title_patientInvites',
        'mcr_title_consultationRooms',
        'mcr_title_discussionRooms'
    ];

    contactMedcryptor = async () => {
        return chatState.startChat([this.helpAccount]);
    };

    skipScreen = () => routes.main.chats();

    renderFeature(title) {
        return (
            <View key={title} style={featureContainer}>
                <Icon
                    style={featureIcon}
                    name="chevron-right"
                    size={vars.iconSizeSmall}
                    color={vars.textBlack54}
                />
                <Text style={featureStyle}>{t(title)}</Text>
            </View>
        );
    }

    renderThrow() {
        return (
            <ScrollView style={container}>
                <View style={wrapper}>
                    <View style={welcomeContainerStyle}>
                        {icons.coloredAsText('check-circle', vars.confirmColor, 60)}
                        <Text style={welcomeHeaderStyle}>{t('mcr_title_thankYou')}</Text>
                    </View>
                    <View style={featureContainerStyle}>
                        <Text style={upgradeDescriptionStyle}>{t('mcr_title_upgrade')}</Text>
                        {this.features.map(f => this.renderFeature(f))}
                    </View>
                    <BlueRoundButton text="mcr_title_getAccount" onPress={this.contactMedcryptor} />
                    <TouchableOpacity
                        pressRetentionOffset={vars.retentionOffset}
                        onPress={this.skipScreen}
                        style={buttonContainerStyle}>
                        <Text style={buttonStyle}>{tu('mcr_title_skip')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}
