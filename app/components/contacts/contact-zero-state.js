import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Image, Dimensions } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';
import testLabel from '../helpers/test-label';
import ViewWithDrawer from '../shared/view-with-drawer';
import drawerState from '../shared/drawer-state';
import { adjustImageDimensions } from '../helpers/image';
import preferenceStore from '../settings/preference-store';
import SyncAddressButton from '../shared/sync-address-button';
import zeroStateBeacons from '../beacons/zerostate-beacons';

const { width } = Dimensions.get('window');

const blueArrowSrc = require('../../assets/arrow-blue.png');
const zeroStateImage = require('../../assets/contact-zero-state.png');

const container = {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center'
};

const wrapper = {
    flex: 1,
    flexGrow: 1
};

const headerStyle = {
    color: vars.peerioBlue,
    fontSize: vars.font.size.huge,
    textAlign: 'center',
    marginTop: vars.spacing.medium.maxi,
    marginBottom: vars.spacing.huge.maxi
};


@observer
export default class ContactZeroStatePlaceholder extends SafeComponent {
    get title() {
        return (
            <View>
                <Text style={headerStyle} {...testLabel('title_addYourContacts')}>
                    {tx('title_addYourContacts')}
                </Text>
                {!drawerState.getDrawer(drawerState.DRAWER_CONTEXT.CONTACTS) && <Image
                    source={blueArrowSrc}
                    style={{
                        width: vars.isDeviceScreenBig ? vars.contactZeroStateArrowWidth : vars.contactZeroStateArrowWidthSmall,
                        height: vars.isDeviceScreenBig ? vars.contactZeroStateArrowHeight : vars.contactZeroStateArrowHeightSmall,
                        position: 'absolute',
                        top: vars.isDeviceScreenBig ? vars.spacing.small.maxi : vars.spacing.small.maxi2x,
                        right: vars.isDeviceScreenBig ? vars.spacing.large.mini : vars.spacing.medium.maxi2x
                    }}
                />}
            </View>
        );
    }

    get zeroStateIllustration() {
        return (
            <View style={{ alignItems: 'center' }}>
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
            <View style={container}>
                <ViewWithDrawer style={wrapper} alwaysBounceVertical={false}>
                    {this.title}
                    {this.zeroStateIllustration}
                    {preferenceStore.prefs.importContactsInBackground
                        ? null : <SyncAddressButton beacon={zeroStateBeacons.syncBeacon} />}
                </ViewWithDrawer>
            </View>
        );
    }
}
