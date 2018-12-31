import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import Text from '../controls/custom-text';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';

const conatinerStyle = {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: vars.spacing.small.midi2x
};

const dateStyle = {
    flex: 0,
    color: vars.txtDark,
    marginHorizontal: vars.spacing.small.mini2x
};

const separator = {
    flex: 1,
    flexGrow: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#CFCFCF',
    height: 11
};

@observer
export default class DateSeparator extends SafeComponent {
    get date() {
        const { timestamp } = this.props;

        const formattedDate = timestamp.toLocaleDateString();
        const formattedNow = new Date().toLocaleDateString();

        if (formattedDate === formattedNow) {
            return tx('title_today');
        }

        return formattedDate;
    }

    renderThrow() {
        if (!this.props.visible) return null;

        return (
            <View style={conatinerStyle}>
                <View style={separator} />
                <Text style={dateStyle}>{this.date}</Text>
                <View style={separator} />
            </View>
        );
    }
}

DateSeparator.propTypes = {
    visible: PropTypes.bool,
    timestamp: PropTypes.any
};
