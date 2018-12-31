import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { Picker, View } from 'react-native';
import _ from 'lodash';
import SafeComponent from '../shared/safe-component';
import { tu } from '../utils/translator';
import uiState from '../layout/ui-state';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import { transitionAnimation } from '../helpers/animations';

@observer
export default class PickerPopup extends SafeComponent {
    constructor(props) {
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
    }

    get value() {
        return this.props.state[this.props.name];
    }

    set value(v) {
        this.props.state[this.props.name] = v;
    }

    componentWillUpdate() {
        transitionAnimation();
    }

    onValueChange(v) {
        this.value = v;
    }

    close() {
        if (!this.value) {
            const options = Object.keys(this.props.data);
            this.value = options[0];
        }
        uiState.pickerVisible = false;
    }

    next(shift) {
        const keys = _.keys(this.props.data);
        let i = keys.indexOf(this.value) + shift;
        if (i < 0) i = 0;
        if (i > keys.length - 1) i = keys.length - 1;
        this.value = keys[i];
    }

    renderThrow() {
        const keys = _.keys(this.props.data);
        const i = keys.indexOf(this.value);
        const items = _.values(
            _.mapValues(this.props.data, (value, key) => (
                <Picker.Item label={value} value={key} key={key} />
            ))
        );
        const topBox = {
            flex: 0,
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderColor: '#00000040',
            backgroundColor: '#00000010',
            justifyContent: 'space-between'
        };

        const containerStyle = {
            backgroundColor: '#fff',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: uiState.pickerVisible ? uiState.pickerHeight : 0
        };

        const pickerStyle = {};

        const up = icons.colored(
            'keyboard-arrow-up',
            () => this.next(-1),
            i > 0 ? vars.bg : vars.disabled
        );

        const down = icons.colored(
            'keyboard-arrow-down',
            () => this.next(1),
            i < keys.length - 1 ? vars.bg : vars.disabled
        );

        return (
            <View style={containerStyle}>
                <View style={topBox}>
                    <View style={{ flexDirection: 'row' }}>
                        {up}
                        {down}
                    </View>
                    {icons.text(tu('button_ok'), () => this.close())}
                </View>
                <Picker
                    style={pickerStyle}
                    selectedValue={this.value}
                    onValueChange={this.onValueChange}>
                    {items}
                </Picker>
            </View>
        );
    }
}

PickerPopup.propTypes = {
    data: PropTypes.any.isRequired,
    state: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired
};
