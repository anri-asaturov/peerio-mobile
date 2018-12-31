import React from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { observer } from 'mobx-react/native';
import Text from '../controls/custom-text';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import plans from '../payments/payments-config';
import SafeComponent from '../shared/safe-component';
import BackIcon from '../layout/back-icon';
import routes from '../routes/routes';
import { uiState } from '../states';
import payments from '../payments/payments';
import BlueRoundButton from '../buttons/blue-round-button';
import whiteLabel from '../whitelabel/white-label-components';

const { width } = Dimensions.get('window');

const subtitleStyle = {
    fontSize: vars.font.size14,
    color: 'white',
    alignSelf: 'center',
    paddingTop: 30
};

const subtitleStyle2 = {
    fontSize: vars.font.size14,
    color: 'white',
    alignSelf: 'center',
    paddingTop: 0,
    paddingBottom: 30
};

const contentContainerStyle = {
    width,
    flexDirection: 'column',
    flexGrow: 1,
    flex: 1,
    backgroundColor: vars.darkBlue
};

@observer
class AccountUpgradeOption extends SafeComponent {
    componentDidMount() {
        uiState.hideTabs = true;
    }

    componentWillUnmount() {
        uiState.hideTabs = false;
    }

    get leftIcon() {
        return <BackIcon action={routes.main.accountUpgrade} />;
    }

    render() {
        return (
            <ScrollView contentContainerStyle={contentContainerStyle}>
                <Text bold style={subtitleStyle}>
                    {tx(this.title)}
                </Text>
                <Text semibold style={subtitleStyle2}>
                    {this.description}
                </Text>
                <View
                    style={{
                        backgroundColor: vars.white,
                        flexGrow: 1,
                        padding: vars.spacing.large.midi
                    }}>
                    <whiteLabel.TermsOfUseUpgrade
                        paymentInfo={this.paymentInfo}
                        title={this.title}
                    />
                    <BlueRoundButton
                        text="button_upgrade"
                        onPress={this.action}
                        style={{ width: vars.wideRoundedButtonWidth }}
                    />
                </View>
            </ScrollView>
        );
    }
}

class AccountUpgradeMonthly extends AccountUpgradeOption {
    get title() {
        return 'title_monthly';
    }

    get description() {
        return plans[1].priceOptions[0].price;
    }

    get paymentInfo() {
        return plans[1].paymentInfoMonthly;
    }

    action() {
        payments.purchase(plans[1].priceOptions[0].id);
    }
}
class AccountUpgradeAnnual extends AccountUpgradeOption {
    get title() {
        return 'title_annual';
    }

    get description() {
        return plans[1].priceOptions[1].price;
    }

    get paymentInfo() {
        return plans[1].paymentInfoAnnual;
    }

    action() {
        payments.purchase(plans[1].priceOptions[1].id);
    }
}

module.exports = { AccountUpgradeMonthly, AccountUpgradeAnnual };
