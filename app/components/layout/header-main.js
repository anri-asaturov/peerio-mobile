import React from 'react';
import { observer } from 'mobx-react/native';
import { TouchableOpacity } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import CommonHeader from '../shared/common-header';
import routerMain from '../routes/router-main';
import { vars } from '../../styles/styles';
import BackIcon from './back-icon';
import testLabel from '../helpers/test-label';
import MeasureableIcon from './measureable-icon';
import chatBeacons from '../beacons/chat-beacons';

@observer
export default class HeaderMain extends SafeComponent {
    renderThrow() {
        let leftIcon = this.props.leftIcon || null;
        const rightIcon = this.props.rightIcon || null;
        if (routerMain.isBackVisible) {
            leftIcon = <BackIcon testID="buttonBackIcon" />;
        }
        const { titleAction } = routerMain;
        const extraMargin = titleAction ? 2 : 0;
        const marginHorizontal =
            rightIcon || leftIcon ? vars.iconSize + 2 * vars.headerIconMargin + extraMargin : 0;
        const textStyle = {
            color: vars.white,
            fontSize: vars.font.size20,
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            flexShrink: 1
        };
        const actionContainerStyle = {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal
        };
        const outerStyle = {
            backgroundColor: vars.darkBlue
        };
        const title = this.props.title || routerMain.title;
        const titleComponent = (
            <TouchableOpacity
                {...testLabel(title)}
                style={actionContainerStyle}
                activeOpacity={titleAction ? 0.2 : 1}
                onPress={titleAction}
                pressRetentionOffset={vars.retentionOffset}>
                <Text semibold ellipsizeMode="middle" numberOfLines={1} style={textStyle}>
                    {title}
                </Text>
                {titleAction && (
                    <MeasureableIcon
                        icon="arrow-drop-down"
                        beacon={chatBeacons.infoPanelBeacon}
                        color={vars.white}
                        onPress={titleAction}
                        spotBgColor={vars.darkBlue}
                    />
                )}
            </TouchableOpacity>
        );
        // this is for animation purposes so that object gets completely redrawn on transition
        const unique = `header_${routerMain.route}_${routerMain.currentIndex}`;
        return <CommonHeader {...{ unique, titleComponent, leftIcon, rightIcon, outerStyle }} />;
    }
}
