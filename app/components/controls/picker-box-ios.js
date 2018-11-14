import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import { View, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import uiState from '../layout/ui-state';
import icons from '../helpers/icons';
import Text from '../controls/custom-text';
import { vars } from '../../styles/styles';

@observer
export default class PickerBoxIos extends SafeComponent {
    @observable opened = false;

    constructor(props) {
        super(props);
        this.focus = this.focus.bind(this);
        this.picker = this.props.picker;
    }

    focus() {
        this.opened = true;
        if (uiState.pickerVisible) {
            uiState.hidePicker();
            return;
        }
        uiState.showPicker(this.picker);
    }


    get errorSpacer() {
        return (<View style={{ height: vars.spacing.medium.mini2x }} />);
    }

    get errorMessage() {
        if (!this.props.value && this.opened) {
            return (
                <Text style={this.props.style.errorStyle}>
                    {this.props.errorMessage}
                </Text>);
        }
        return this.errorSpacer;
    }

    renderThrow() {
        const focused = uiState.pickerVisible && uiState.picker === this.picker;
        const { shadow, background, textview, container, iconContainer, icon } =
            focused ? this.props.style.active : this.props.style.normal;
        const value = this.props.value ? this.props.data[this.props.value] : this.props.hint;
        return (
            <View>
                <View style={shadow}>
                    <View
                        style={background}>
                        <TouchableOpacity
                            testID="pickerBox"
                            onPress={this.focus}
                            pressRetentionOffset={vars.retentionOffset}>
                            <View
                                pointerEvents="none"
                                style={container}>
                                <Text style={[textview, (this.props.value ? { color: vars.textBlack87 } : { color: vars.textBlack38 })]}>
                                    {value}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <View
                            pointerEvents="none"
                            style={iconContainer}>
                            {icons.dark('arrow-drop-down', () => { }, icon)}
                        </View>
                    </View>
                </View>
                {this.errorMessage}
            </View>
        );
    }
}

PickerBoxIos.propTypes = {
    value: PropTypes.any.isRequired,
    picker: PropTypes.any.isRequired,
    data: PropTypes.any.isRequired,
    style: PropTypes.any.isRequired,
    hint: PropTypes.any.isRequired
};
