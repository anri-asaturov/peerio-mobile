import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import SnackBarConnection from '../snackbars/snackbar-connection';
import uiState from '../layout/ui-state';

@observer
export default class Layout3 extends SafeComponent {
    renderThrow() {
        const boxStyle = {
            flexGrow: 1,
            flexDirection: 'column',
            paddingBottom: global.platform === 'android' ? 0 : uiState.keyboardHeight
        };

        const fillerStyle = {
            // if we put scrollview directly into body
            // flex: 1 should be present for correct height calculations
            flex: 1,
            flexGrow: 1
        };

        return (
            <View style={[boxStyle, this.props.style]}>
                <View style={{ flex: 0 }}>{this.props.header}</View>
                <View style={fillerStyle}>{this.props.body}</View>
                <View style={{ flex: 0 }}>{this.props.footer}</View>
                {this.props.footerAbsolute}
                <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
                    <SnackBarConnection />
                </View>
            </View>
        );
    }
}

Layout3.propTypes = {};
