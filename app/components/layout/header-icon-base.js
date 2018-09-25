import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import testLabel from '../helpers/test-label';
import MeasureableIcon from './measureable-icon';

const itemStyle = {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: vars.headerIconMargin
};

@observer
export default class HeaderIconBase extends SafeComponent {
    icon = '';
    action = () => { };
    disabled = false;
    beacon = null;
    iconSource = null;

    @action.bound
    onPress() {
        return this.disabled ? null : this.action();
    }

    renderThrow() {
        return (
            <View style={[{ flex: 0, opacity: this.disabled ? 0.5 : 1 }, this.style]}>
                <TouchableOpacity
                    pressRetentionOffset={vars.retentionOffset}
                    onPress={this.onPress}
                    activeOpacity={this.disabled ? 0.5 : 1}
                    {...testLabel(this.props.testID)} >
                    <View style={[itemStyle, this.innerStyle]} >
                        <MeasureableIcon
                            icon={this.icon}
                            iconSource={this.iconSource}
                            color={vars.white}
                            beacon={this.beacon}
                            spotBgColor={vars.darkBlue}
                            onPress={this.onPress}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
