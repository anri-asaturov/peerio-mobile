import React from 'react';
import { View, ScrollView } from 'react-native';
import { observer } from 'mobx-react/native';
import { action, observable } from 'mobx';
import { vars } from '../../styles/styles';
import ListWithDrawer from './list-with-drawer';

@observer
export default class ViewWithDrawer extends ListWithDrawer {
    @observable layoutHeight;

    @action.bound scrollViewRef(sv) {
        this.props.setScrollViewRef && this.props.setScrollViewRef(sv);
        this.scrollView = sv;
    }

    scrollDrawerOutOfView = (animated) => {
        this.scrollView && this.scrollView.scrollTo({
            y: vars.topDrawerHeight,
            animated
        });
    };

    scrollToStart = (animated) => {
        this.scrollView && this.scrollView.scrollTo({
            y: 0,
            animated
        });
    };

    renderThrow() {
        const minHeight = this.layoutHeight + (this.androidExtraScrollingSpace ? vars.topDrawerHeight : 0);
        return (
            <ScrollView
                onLayout={(event) => { this.layoutHeight = event.nativeEvent.layout.height; }}
                ref={this.scrollViewRef}
                {...this.props.scrollHelper}
                {...this.props} >
                {this.topDrawer}
                <View style={{ minHeight }}>
                    {this.props.children}
                </View>
            </ScrollView>);
    }
}
