import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, StatusBar } from 'react-native';
import SafeComponent from '../shared/safe-component';
import SnackBarConnection from '../snackbars/snackbar-connection';
import SnackBar from '../snackbars/snackbar';
import Bottom from '../controls/bottom';
import ActivityOverlay from '../controls/activity-overlay';
import signupState from '../signup/signup-state';

@observer
export default class LayoutSignup extends SafeComponent {
    constructor(props) {
        super(props);
        this.layout = this.layout.bind(this);
        this.scroll = this.scroll.bind(this);
    }

    layout(e) {
        this.scrollViewHeight = e.nativeEvent.layout.height;
    }

    scroll(e) {
        this.scrollViewTop = e.nativeEvent.contentOffset.y;
    }

    renderThrow() {
        return (
            <View style={{ flexGrow: 1 }}>
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    alwaysBounceVertical={false}
                    style={{ flexGrow: 1 }}>
                    {this.props.body}
                    {this.props.footer}
                    {!signupState.isPdfPreviewVisible && <StatusBar hidden />}
                </ScrollView>
                <Bottom>
                    <SnackBarConnection />
                    <SnackBar />
                </Bottom>
                <ActivityOverlay large visible={signupState.isInProgress} />
            </View>
        );
    }
}
