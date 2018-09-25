import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import { vars, signupStyles } from '../../styles/styles';
import icons from '../helpers/icons';
import SafeComponent from '../shared/safe-component';

@observer
export default class ButtonBack extends SafeComponent {
    renderThrow() {
        return (
            <View style={signupStyles.backButtonContainer}>
                {icons.basic(
                    'arrow-back',
                    vars.darkBlue,
                    this.props.onBackPressed,
                    { backgroundColor: 'transparent' },
                    null,
                    true,
                    'back')}
            </View>
        );
    }
}
