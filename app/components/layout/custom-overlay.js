import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { uiState } from '../states';

@observer
export default class CustomOverlay extends SafeComponent {
    renderThrow() {
        if (!uiState.customOverlayComponent) return null;
        const container = { alignItems: 'center' };
        return <View style={container}>{uiState.customOverlayComponent}</View>;
    }
}
