import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import { vars } from '../../styles/styles';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';

const marginBottom = vars.spacing.medium.mini2x;

const headerStyle = {
    fontSize: vars.isDeviceScreenBig ? vars.font.size36 : vars.font.size30,
    color: vars.darkBlue,
    marginBottom
};

const headerDescription = {
    fontSize: vars.isDeviceScreenBig ? vars.font.size18 : vars.font.size14,
    color: vars.textBlack54
};

@observer
export default class LoginHeading extends SafeComponent {
    renderThrow() {
        const { title, subTitle } = this.props;
        return (
            <View style={{ marginBottom }}>
                <Text semibold serif style={headerStyle}>
                    {tx(title)}
                </Text>
                <Text style={headerDescription}>{tx(subTitle)}</Text>
            </View>
        );
    }
}
