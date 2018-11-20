import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SafeComponent from '../../shared/safe-component';
import { vars } from '../../../styles/styles';
import { tx } from '../../utils/translator';
import Text from '../../controls/custom-text';

const container = {
    margin: vars.spacing.small.midi2x,
    flexDirection: 'row'
};

const icon = {
    alignSelf: 'center',
    marginRight: vars.spacing.small.midi2x
};

const text = {
    color: vars.txtDate,
    marginVertical: vars.spacing.small.mini2x
};

@observer
export default class MedcryptorContactAddWarning extends SafeComponent {
    renderThrow() {
        return (
            <View style={container}>
                <Icon style={icon} name="security" size={vars.iconSize} color="gray" />
                <Text style={text}>{tx('mcr_warning_addContact')}</Text>
            </View>
        );
    }
}
