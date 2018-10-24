import PropTypes from 'prop-types';
import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react/native';
import { TouchableOpacity, View, FlatList } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import tm from '../../telemetry';
import { telemetry } from '../../lib/icebear';

const { S } = telemetry;

const textTitleStyle = {
    flex: 1,
    fontSize: vars.isDeviceScreenBig ? vars.font.size16 : vars.font.size14
};
const textStyle = {
    color: vars.textBlack54
};
const paragraphStyle = {
    flex: 0,
    paddingLeft: vars.spacing.large.maxi,
    paddingRight: vars.spacing.large.midi,
    paddingBottom: vars.spacing.medium.maxi2x
};

@observer
export default class TosAccordionItem extends SafeComponent {
    @observable isOpen = false;

    @action.bound toggle() {
        this.isOpen = !this.isOpen;
        // Only need to send TM event on Open
        if (this.isOpen) {
            if (this.props.data.title === 'title_termsOfUse') {
                tm.signup.readMoreAccordion(S.TERMS_OF_USE_SUMMARY);
            } else tm.signup.readMoreAccordion(tx(this.props.data.title));
        }
    }

    keyExtractor = item => item.subtitle;

    paragraphItem({ item }) {
        return (<View style={paragraphStyle}>
            <Text bold style={textStyle}>{tx(item.subtitle)}</Text>
            <Text style={textStyle}>{tx(item.description)}</Text>
        </View>);
    }

    renderThrow() {
        const { index, data } = this.props;
        const { title, leftIcon, content } = data;
        const container = {
            flex: 1,
            backgroundColor: this.isOpen ? vars.black05 : 'white'
        };
        const titleStyle = {
            flex: 1,
            flexShrink: 1,
            height: 64,
            flexDirection: 'row',
            borderColor: vars.darkBlueDivider12,
            alignItems: 'center',
            borderTopWidth: index ? 1 : 0,
            marginBottom: this.isOpen ? vars.spacing.small.midi2x : 0
        };
        const rightIconName = this.isOpen ? 'keyboard-arrow-down' : 'keyboard-arrow-right';
        const titleTextColor = this.isOpen ? vars.textBlack87 : vars.textBlack54;

        return (
            <View style={container}>
                <TouchableOpacity onPress={this.toggle} style={titleStyle}>
                    {this.isOpen ? leftIcon.on : leftIcon.off}
                    <Text semibold style={[textTitleStyle, { color: titleTextColor }]}>{tx(title)}</Text>
                    {icons.darkNoPadding(rightIconName, this.toggle)}
                </TouchableOpacity>
                {this.isOpen ? <FlatList
                    data={content}
                    keyExtractor={this.keyExtractor}
                    renderItem={this.paragraphItem}
                /> : null}
            </View>
        );
    }
}

TosAccordionItem.propTypes = {
    index: PropTypes.number,
    data: PropTypes.any
};
