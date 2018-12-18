import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import { vars } from '../../styles/styles';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';

const marginBottom = 10;
const marginTop = vars.spacing.small.maxi2x;

const headerStyle = {
    fontSize: vars.isDeviceScreenBig ? vars.font.size27 : vars.font.size24,
    color: vars.darkBlue,
    marginBottom
};

const headerDescription = {
    fontSize: vars.isDeviceScreenBig ? vars.font.size18 : vars.font.size14,
    color: vars.textBlack54,
    marginBottom: marginBottom + 10
};

@observer
export default class SignupHeading extends SafeComponent {
    renderThrow() {
        const { title, subTitle } = this.props;
        return (
            <View style={{ marginTop }}>
                <Text semibold serif style={headerStyle}>
                    {tx(title)}
                </Text>
                {subTitle && <Text style={headerDescription}>{tx(subTitle)}</Text>}
            </View>
        );
    }
}
