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
const zeroStateImage = require('../../assets/contact-zero-state.png');

const container = {
    flex: 1,
    flexGrow: 1,
    backgroundColor: vars.darkBlueBackground05
};
const headerStyle = {
    fontSize: vars.font.size.big,
    color: vars.textBlack87,
    paddingTop: vars.spacing.huge.midi3x,
    paddingBottom: vars.spacing.large.midi2x,
    textAlign: 'center'
};
const centeredText = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
};
const illustrationTextStyle = {
    color: vars.textBlack54,
    textAlign: 'center'
};

@observer
export default class WelcomeZeroState extends SafeComponent {
    get layoutTitle() {
        return tx('title_zeroFirstLoginTitle');
    }

    get zeroStateIllustration() {
        return (
            <View style={{ alignItems: 'center' }}>
                <View style={centeredText}>
                    <Text style={illustrationTextStyle}>{tx('title_learnFollowWalkthroughMobile')}</Text>
                </View>
                <Image
                    source={zeroStateImage}
                    style={[adjustImageDimensions(zeroStateImage, width - vars.spacing.medium.mini2x * 2, null),
                        { marginBottom: vars.spacing.huge.maxi }
                    ]}
                />
            </View>);
    }

    renderThrow() {
        return (
            <View style={{ flexGrow: 1 }}>
                <ViewWithDrawer style={container}>
                    <Text style={headerStyle}>{tx('title_zeroFirstLoginMessage')}</Text>
                    {this.zeroStateIllustration}
                </ViewWithDrawer>
            </View>
        );
    }
}
