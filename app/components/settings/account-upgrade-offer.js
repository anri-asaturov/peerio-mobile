import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, Dimensions } from 'react-native';
import { vars } from '../../styles/styles';
import routes from '../routes/routes';
import { User } from '../../lib/icebear';
import { popupYes } from '../shared/popups';
import Text from '../controls/custom-text';
import { tx, t } from '../utils/translator';
import buttons from '../helpers/buttons';
import icons from '../helpers/icons';
import plans from '../payments/payments-config';
import SafeComponent from '../shared/safe-component';
import BackIcon from '../layout/back-icon';
import { uiState } from '../states';

const { width } = Dimensions.get('window');

const subtitleStyle = {
    color: 'white',
    alignSelf: 'center',
    paddingTop: 50,
    paddingBottom: 30
};

const actionStyle = {
    color: vars.black54,
    alignSelf: 'center',
    paddingTop: 100,
    paddingBottom: 30,
    fontSize: vars.font.size18
};

const featureSmallText = {
    color: vars.black54,
    fontSize: vars.font.size14,
    paddingLeft: 6
};

const buttonContainer = {
    marginBottom: vars.spacing.small.maxi2x,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const contentContainerStyle = {
    width,
    flexDirection: 'column',
    flexGrow: 1,
    flex: 1
};

const container = {
    flex: 1,
    flexGrow: 1,
    backgroundColor: vars.darkBlue
};

@observer
export default class AccountUpgradeOffer extends SafeComponent {
    componentWillMount() {
        if (User.current) {
            console.log('account-upgrade-swiper: active plans');
            User.current && console.log(User.current.activePlans);
            if (User.current.addresses.filter(e => e.confirmed).length === 0) {
                popupYes('', '', t('error_upgradingAccountNoConfirmedEmail')).then(() =>
                    routes.main.settings()
                );
            }
        }
    }

    componentDidMount() {
        uiState.hideTabs = true;
    }

    componentWillUnmount() {
        uiState.hideTabs = false;
    }

    get leftIcon() {
        return <BackIcon action={routes.main.settings} />;
    }

    featureText(text) {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                {icons.coloredAsText('check', vars.black54, 16)}
                <Text semibold key={text} style={featureSmallText}>
                    {text}
                </Text>
            </View>
        );
    }

    get footer() {
        const { priceOptions } = plans[1];
        return (
            <View style={buttonContainer}>
                {buttons.roundBlueBgButtonWithSubtitle(
                    priceOptions[1].price,
                    tx(priceOptions[1].title),
                    () => routes.main.accountUpgradeAnnual(),
                    null,
                    null,
                    { width: vars.roundedButtonWidth, marginRight: 6 }
                )}
                {buttons.roundWhiteBgButtonWithSubtitle(
                    priceOptions[0].price,
                    tx(priceOptions[0].title),
                    () => routes.main.accountUpgradeMonthly(),
                    null,
                    null,
                    { width: vars.roundedButtonWidth }
                )}
            </View>
        );
    }

    render() {
        const { info } = plans[1];
        return (
            <View style={container}>
                <ScrollView contentContainerStyle={contentContainerStyle}>
                    <Text semibold style={subtitleStyle}>
                        {tx('description_peerio_pro')}
                    </Text>
                    <View
                        style={{
                            backgroundColor: vars.white,
                            flexGrow: 1,
                            padding: vars.spacing.large.midi
                        }}>
                        <Text
                            semibold
                            style={{
                                color: vars.black54,
                                fontSize: vars.font.size18,
                                paddingBottom: 18
                            }}>
                            {tx('title_upgrade')}
                        </Text>
                        {info.split('\n').map(this.featureText)}
                        <Text semibold style={actionStyle}>
                            {tx('title_get_peerio_pro')}
                        </Text>
                        {this.footer}
                    </View>
                </ScrollView>
            </View>
        );
    }
}
