import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { TouchableOpacity, View } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import { tu } from '../utils/translator';
import testLabel from '../helpers/test-label';

@observer
export default class UnreadMessageIndicator extends SafeComponent {
    renderThrow() {
        const { isAlignedTop, action } = this.props;
        const container = {
            position: 'absolute',
            right: 0,
            left: 0,
            height: 36,
            marginHorizontal: vars.spacing.small.midi2x,
            backgroundColor: vars.peerioBlue,
            justifyContent: 'center',
            alignItems: 'center'
        };
        const topAlignStyle = {
            top: 0,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10
        };
        const bottomAlignStyle = {
            bottom: 0,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
        };
        const alignmentStyle = isAlignedTop ? topAlignStyle : bottomAlignStyle;
        const marginTopStyle = !isAlignedTop ? { marginTop: vars.spacing.small.mini2x } : null;
        const text = {
            color: 'white',
            marginRight: vars.spacing.small.mini2x,
            marginTop: isAlignedTop ? vars.spacing.small.mini : null
        };
        const iconName = isAlignedTop ? 'keyboard-arrow-up' : 'keyboard-arrow-down';
        const testLabelName = isAlignedTop ? 'chatlist-unread-indicator-top' : 'chatlist-unread-indicator-bottom';
        return (
            <TouchableOpacity
                pressRetentionOffset={vars.retentionOffset}
                style={[container, alignmentStyle]}
                onPress={action}
                {...testLabel(testLabelName)} >
                <View style={[marginTopStyle, { flexDirection: 'row' }]}>
                    <Text semibold style={text}>{tu('title_unreadMessages')}</Text>
                    {icons.plainWhite(iconName, vars.iconSize)}
                </View>
            </TouchableOpacity>
        );
    }
}

UnreadMessageIndicator.propTypes = {
    isAlignedTop: PropTypes.bool,
    action: PropTypes.any
};
