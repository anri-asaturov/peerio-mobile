import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Picker } from 'react-native';
import _ from 'lodash';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';

@observer
export default class PickerBoxAndroid extends SafeComponent {
    get value() {
        return this.props.state[this.props.name];
    }

    set value(v) {
        this.props.state[this.props.name] = v;
    }

    onValueChange = v => {
        if (v) this.value = v;
    };

    renderThrow() {
        const { shadow, iconContainer, icon } = this.props.style.normal;
        const defaultOption = [
            <Picker.Item label={`- ${this.props.hint} -`} value={null} key={null} />
        ];
        const items = _.values(
            _.mapValues(this.props.data, (value, key) => (
                <Picker.Item label={value} value={key} key={key} />
            ))
        );

        return (
            <View style={shadow}>
                <Picker
                    selectedValue={this.value}
                    onValueChange={this.onValueChange}
                    style={[
                        { backgroundColor: vars.pickerBg },
                        this.props.value ? { color: vars.textBlack87 } : { color: vars.textBlack38 }
                    ]}>
                    {defaultOption.concat(items)}
                </Picker>
                <View pointerEvents="none" style={iconContainer}>
                    {icons.dark('arrow-drop-down', () => {}, icon)}
                </View>
            </View>
        );
    }
}

PickerBoxAndroid.propTypes = {
    value: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    picker: PropTypes.any.isRequired,
    data: PropTypes.any.isRequired,
    style: PropTypes.any.isRequired,
    hint: PropTypes.any.isRequired
};
