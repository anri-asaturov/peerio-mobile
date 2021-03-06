import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { tx, tu } from '../utils/translator';
import { vars } from '../../styles/styles';
import payments from '../payments/payments';
import ChoiceItem from './choice-item';
import { User } from '../../lib/icebear';
import plans from '../payments/payments-config';

const margin = vars.spacing.medium.midi;
const marginLeft = margin;
const marginBottom = vars.spacing.small.maxi2x;
const paddingWhite = 10;
const marginWhite = margin - paddingWhite;

const smallLabel = {
    color: vars.txtDate,
    fontSize: vars.font.size10
};

const boldLabel = {
    color: vars.txtDark,
    fontSize: vars.font.size16
};

const mediumLabel = {
    color: vars.txtDate,
    fontSize: vars.font.size14
};

const descLabel = {
    color: vars.txtDark,
    fontSize: vars.font.size12
};

const descIncludesLabel = [
    descLabel,
    {
        marginBottom: margin
    }
];

@observer
export default class AccountUpgrade extends SafeComponent {
    titleBlock(boldText, normalText, rightBlock) {
        return (
            <View
                style={{
                    margin,
                    marginBottom,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                <Text>
                    <Text bold style={boldLabel}>
                        {boldText}
                    </Text>
                    <Text> - </Text>
                    <Text style={mediumLabel}>{normalText}</Text>
                </Text>
                {rightBlock}
            </View>
        );
    }

    label(title) {
        return <Text style={smallLabel}>{tx(title)}</Text>;
    }

    renderButton1(text, onPress, disabled) {
        return (
            <TouchableOpacity
                onPress={disabled ? null : onPress}
                pressRetentionOffset={vars.retentionOffset}
                style={{ paddingTop: vars.spacing.small.mini }}>
                <Text bold style={{ color: disabled ? vars.txtMedium : vars.peerioBlue }}>
                    {tu(text)}
                </Text>
            </TouchableOpacity>
        );
    }

    componentDidMount() {
        console.log(User.current.activePlans);
        plans.forEach(s => s.setDefaultSelected());
    }

    renderPlan = plan => {
        let actionButton = null;
        if (plan.isCurrent) actionButton = <Text style={smallLabel}>(current)</Text>;
        let { price } = plan;
        let choiceItem = null;
        if (plan.priceOptions && plan.priceOptions.length) {
            const priceOptions = plan.priceOptions.filter(p => p.id === plan.selected)[0];
            if (!priceOptions) return null;
            ({ price } = priceOptions);

            if (!plan.isCurrent && plan.canUpgradeTo) {
                actionButton = this.renderButton1('button_upgrade', () =>
                    payments.purchase(plan.selected)
                );
            }
            if (plan.isCurrent) {
                actionButton = this.renderButton1('button_active', null, true);
            }
            choiceItem = <ChoiceItem options={plan.priceOptions} state={plan} />;
        }
        return (
            <View key={plan.title}>
                {this.titleBlock(plan.title, price, actionButton)}
                <View style={{ marginLeft }}>{this.label(tx('title_features'))}</View>
                <View style={{ margin: marginWhite }}>{choiceItem}</View>
                <View
                    style={{
                        backgroundColor: vars.white,
                        margin: marginWhite,
                        padding: paddingWhite
                    }}>
                    {plan.includes && (
                        <Text italic style={descIncludesLabel}>
                            {plan.includes}
                        </Text>
                    )}
                    <Text style={descLabel}>{plan.info}</Text>
                </View>
            </View>
        );
    };

    renderThrow() {
        return (
            <ScrollView
                keyboardShouldPersistTaps="handled"
                style={{ backgroundColor: vars.darkBlueBackground05 }}>
                {plans.map(this.renderPlan)}
            </ScrollView>
        );
    }
}
