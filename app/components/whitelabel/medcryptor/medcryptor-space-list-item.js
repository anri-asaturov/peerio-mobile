import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import Text from '../../controls/custom-text';
import SafeComponent from '../../shared/safe-component';
import { vars } from '../../../styles/styles';
import chatState from './../../messaging/chat-state';
import testLabel from '../../helpers/test-label';
import icons from '../../helpers/icons';
import { t } from '../../utils/translator';
import routes from '../../routes/routes';

const containerStyle = {
    height: vars.sectionHeaderHeight,
    paddingHorizontal: vars.spacing.medium.midi,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: vars.white,
    flexDirection: 'row'
};

const textStyle = {
    fontSize: vars.font.size16,
    color: vars.subtleText
};

const textUnreadStyle = { color: vars.unreadTextColor };

const circleStyle = {
    marginLeft: vars.spacing.small.mini,
    width: vars.unreadCircleWidth + vars.spacing.small.mini,
    height: vars.unreadCircleHeight,
    borderRadius: 14,
    backgroundColor: vars.peerioTeal,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
};

const textCircleStyle = {
    fontSize: vars.font.size14,
    color: vars.badgeText
};

const nameContainerStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexGrow: 1
};

const newCircleStyle = {
    paddingHorizontal: 4,
    paddingVertical: 1,
    maxWidth: 32,
    borderRadius: 5,
    backgroundColor: vars.invitedBadgeColor,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
};

const textNewStyle = {
    fontSize: vars.font.size12,
    color: vars.invitedBadgeText
};

@observer
export default class MedcryptorSpaceListItem extends SafeComponent {
    onPress = () => {
        const { spaceId } = this.props.space;
        chatState.store.spaces.activeSpaceId = spaceId;
        return routes.main.space();
    };

    renderThrow() {
        if (!this.props.space) return null;
        const { spaceName, unreadCount } = this.props.space;
        const hasUnread = unreadCount > 0;
        const hasInvites = this.props.space.allRooms.some(x => x.kegDbId);

        return (
            <View style={{ backgroundColor: vars.chatItemPressedBackground }}>
                <TouchableOpacity
                    {...testLabel(spaceName)}
                    onPress={this.onPress}
                    style={containerStyle}
                    pressRetentionOffset={vars.retentionOffset}>
                    <View style={nameContainerStyle}>
                        <Text
                            semibold={hasUnread}
                            style={[textStyle, hasUnread && textUnreadStyle]}>
                            {`${spaceName}`}
                        </Text>
                        {icons.dark('chevron-right', this.onPress)}
                    </View>
                    {hasInvites && (
                        <View style={newCircleStyle}>
                            <Text style={textNewStyle}>{t('title_new')}</Text>
                        </View>
                    )}
                    {hasUnread && (
                        <View style={circleStyle}>
                            <Text semibold style={textCircleStyle}>
                                {unreadCount}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>
        );
    }
}

MedcryptorSpaceListItem.propTypes = {
    space: PropTypes.any.isRequired
};
