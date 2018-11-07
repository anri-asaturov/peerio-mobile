import React from 'react';
import { observer } from 'mobx-react/native';
import { Image, View, Dimensions } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { adjustImageDimensions } from '../helpers/image';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import ViewWithDrawer from '../shared/view-with-drawer';

const { width } = Dimensions.get('window');

const zeroStateImage = process.env.EXECUTABLE_NAME === 'medcryptor' ?
    require('../../assets/welcome-zero-state-medcryptor.png') : require('../../assets/welcome-zero-state.png');

const container = {
    flex: 1,
    flexGrow: 1,
    backgroundColor: vars.darkBlueBackground05
};
const headerStyle = {
    fontSize: vars.font.size24,
    color: vars.darkBlue,
    paddingTop: vars.isDeviceScreenBig ? vars.spacing.huge.mini : vars.spacing.medium.maxi2x,
    textAlign: 'center',
    lineHeight: 30,
    marginHorizontal: 16
};
const descriptionTextStyle = {
    fontSize: vars.font.size12,
    color: vars.textDarkBlue54,
    textAlign: 'center',
    paddingTop: vars.isDeviceScreenBig ? vars.spacing.medium.midi2x : vars.spacing.medium.mini2x,
    lineHeight: 20
};

@observer
export default class WelcomeZeroState extends SafeComponent {
    get layoutTitle() {
        return tx('title_zeroFirstLoginTitle');
    }

    get zeroStateIllustration() {
        return (
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <Image
                    source={zeroStateImage}
                    style={adjustImageDimensions(zeroStateImage, width, null)}
                />
            </View>);
    }

    renderThrow() {
        return (
            <View style={{ flexGrow: 1 }}>
                <ViewWithDrawer style={container}>
                    <Text semibold serif style={headerStyle}>{tx('title_zeroFirstLoginMessage')}</Text>
                    <Text style={descriptionTextStyle}>{tx('title_learnFollowWalkthroughMobile')}</Text>
                    {this.zeroStateIllustration}
                </ViewWithDrawer>
            </View>
        );
    }
}
