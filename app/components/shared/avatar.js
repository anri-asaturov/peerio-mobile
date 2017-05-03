import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import FileInlineProgress from '../files/file-inline-progress';
import AvatarCircle from './avatar-circle';
import ErrorCircle from './error-circle';
import OnlineCircle from './online-circle';
import ReadReceiptList from './read-receipt-list';
import CorruptedMessage from './corrupted-message';
import tagify from './tagify';

const itemStyle = {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 0,
    borderColor: 'red'
};

const bottomBorderStyle = {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, .12)'
};

const itemContainerStyle = {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 4,
    paddingBottom: 0

};

const nameContainerStyle = {
    borderWidth: 0,
    borderColor: 'red',
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center'
};

const nameMessageContainerStyle = {
    flexGrow: 1,
    flexShrink: 1,
    borderWidth: 0,
    borderColor: 'red',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 16,
    marginLeft: 6,
    marginRight: 6,
    paddingTop: 0
};

const nameTextStyle = {
    color: vars.txtMedium,
    fontWeight: vars.font.weight.bold,
    fontSize: 14
};

const dateTextStyle = {
    color: vars.txtDate,
    marginLeft: 8
};

const lastMessageTextStyle = {
    flexGrow: 1,
    flexShrink: 1,
    fontWeight: vars.font.weight.regular,
    color: vars.txtMedium,
    fontSize: 14,
    lineHeight: 22
};

const systemMessageStyle = {
    fontStyle: 'italic'
};

@observer
export default class Avatar extends Component {
    @observable showError = false;

    get checked() {
        const cs = this.props.checkedState;
        const ck = this.props.checkedKey;
        return cs && ck && !!cs.has(ck);
    }

    get checkbox() {
        if (!this.props.checkbox) return null;
        const v = vars;
        const color = this.checked ? v.checkboxActive : v.checkboxInactive;
        const iconColor = this.checked ? 'white' : v.checkboxIconInactive;
        const iconBgColor = 'transparent';
        const icon = this.checked ? 'check-box' : 'check-box-outline-blank';
        const outer = {
            backgroundColor: color,
            padding: 4
        };
        return (
            <View style={outer} pointerEvents="none">
                {icons.colored(icon, null, iconColor, iconBgColor)}
            </View>
        );
    }

    onPressAll = () => {
        console.log(`avatar.js: onPressText`);
        if (this.props.error) {
            this.showError = !this.showError;
            return null;
        }
        if (this.props.sendError && this.props.onRetryCancel) {
            return this.props.onRetryCancel();
        }
        return this.props.onPress && this.props.onPress();
    }

    get message() {
        const { ellipsize, bold } = this.props;
        const ellipsizeMode = ellipsize ? 'tail' : undefined;
        const numberOfLines = ellipsize ? 1 : undefined;
        const boldStyle = bold ? { fontWeight: 'bold' } : null;
        return this.props.message ? (
            <Text
                ellipsizeMode={ellipsizeMode}
                numberOfLines={numberOfLines}
                selectable
                style={[lastMessageTextStyle, boldStyle]}>
                {tagify(this.props.message || '')}
            </Text>
        ) : null;
    }

    get systemMessage() {
        const { systemMessage } = this.props;
        return systemMessage && (
            <Text style={[lastMessageTextStyle, systemMessageStyle]}>
                {systemMessage}
            </Text>
        );
    }

    get files() {
        return this.props.files ?
            this.props.files.map(file => <FileInlineProgress key={file} file={file} />) : null;
    }

    get errorCircle() {
        return <ErrorCircle onPress={this.onPressAll} invert={!this.props.sendError} visible={this.props.error || this.props.sendError} />;
    }

    get corruptedMessage() {
        return <CorruptedMessage visible={this.props.error && this.showError} />;
    }

    get retryCancel() {
        const notSentMessageStyle = {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginBottom: 8
        };
        return this.props.sendError ?
            <View style={notSentMessageStyle}>
                <Text style={{ color: vars.txtAlert }}>Message not sent</Text>
            </View> : null;
    }

    get icon() {
        return this.props.icon ? icons.dark(this.props.icon) : null;
    }

    get date() {
        return !!this.props.date &&
            <Text style={dateTextStyle}>{moment(this.props.date).format(`MMM D, LT`)}</Text>;
    }

    get errorStyle() {
        return this.props.error ? {
            backgroundColor: '#ff000020',
            borderRadius: 14,
            marginVertical: 2,
            marginHorizontal: 4
        } : null;
    }

    get borderStyle() {
        return this.props.noBorderBottom ? null : bottomBorderStyle;
    }

    get paddingStyle() {
        const paddingVertical = this.props.extraPaddingVertical;
        return paddingVertical ? { paddingVertical } : null;
    }

    get checkedStyle() {
        if (this.props.checkbox) return null;
        return { backgroundColor: vars.bg };
    }

    get avatar() {
        return (
            <TouchableOpacity
                pressRetentionOffset={vars.retentionOffset}
                onPress={this.props.onPressAvatar || this.onPressAll}>
                <AvatarCircle contact={this.props.contact} loading={this.props.loading} />
            </TouchableOpacity>
        );
    }

    get title() {
        return (
            <View style={nameContainerStyle}>
                <View style={{ flexShrink: 1 }}>
                    <Text ellipsizeMode="tail" style={nameTextStyle}>
                        {this.props.title || this.props.contact.username}
                    </Text>
                </View>
                <View style={{ flex: 0 }}>
                    {this.date}
                </View>
            </View>
        );
    }

    renderCollapsed() {
        return (
            <View style={[itemStyle, this.errorStyle]}>
                <View style={[this.itemContainerStyle, { marginLeft: 74 }]}>
                    {this.message}
                    <View style={{ flexGrow: 1 }}>
                        {this.corruptedMessage}
                        {this.files}
                        {this.systemMessage}
                        {this.retryCancel}
                    </View>
                </View>
                {this.errorCircle}
            </View>
        );
    }

    renderFull() {
        return (
            <View style={[itemStyle, this.borderStyle, this.errorStyle, this.paddingStyle]}>
                {this.checkbox}
                <View style={[{ flexGrow: 1 }]}>
                    <View style={itemContainerStyle}>
                        {this.avatar}
                        <View style={[nameMessageContainerStyle, { width: this.props.ellipsize ? 100 : undefined }]}>
                            {this.title}
                            {this.message}
                            {this.files}
                            {this.systemMessage}
                            {this.retryCancel}
                        </View>
                        {this.icon}
                        <OnlineCircle visible={!this.props.hideOnline} online={this.props.online} />
                    </View>
                    {this.errorCircle}
                    {this.corruptedMessage}
                    <ReadReceiptList receipts={this.props.receipts} />
                </View>
            </View>
        );
    }

    renderOuter(inner) {
        const opacity = this.props.sending ? 0.5 : 1;
        const activeOpacity = this.props.noTap && !this.props.error && !this.props.sendError ?
            1 : 0.2;
        return (
            <View
                style={{ backgroundColor: vars.white, opacity }}
                onLayout={this.props.onLayout}>
                <TouchableOpacity
                    pressRetentionOffset={vars.retentionOffset}
                    onPress={this.onPressAll}
                    activeOpacity={activeOpacity}>
                    {inner}
                </TouchableOpacity>
            </View >
        );
    }

    render() {
        const inner = this.props.collapsed ? this.renderCollapsed() : this.renderFull();
        return this.renderOuter(inner);
    }
}

Avatar.propTypes = {
    onPress: React.PropTypes.func,
    onPressAvatar: React.PropTypes.func,
    onRetryCancel: React.PropTypes.func,
    contact: React.PropTypes.any.isRequired,
    date: React.PropTypes.any,
    files: React.PropTypes.any,
    receipts: React.PropTypes.any,
    icon: React.PropTypes.string,
    message: React.PropTypes.string,
    title: React.PropTypes.string,
    systemMessage: React.PropTypes.any,
    online: React.PropTypes.bool,
    error: React.PropTypes.bool,
    loading: React.PropTypes.bool,
    showError: React.PropTypes.bool,
    checkbox: React.PropTypes.bool,
    checkedKey: React.PropTypes.string,
    checkedState: React.PropTypes.any,
    hideOnline: React.PropTypes.bool,
    noBorderBottom: React.PropTypes.bool,
    noTap: React.PropTypes.bool,
    collapsed: React.PropTypes.bool,
    sending: React.PropTypes.bool,
    sendError: React.PropTypes.bool,
    ellipsize: React.PropTypes.bool,
    bold: React.PropTypes.bool,
    extraPaddingVertical: React.PropTypes.number,
    onLayout: React.PropTypes.func
};

