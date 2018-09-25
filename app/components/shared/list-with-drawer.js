import React from 'react';
import { View, Platform } from 'react-native';
import { observer } from 'mobx-react/native';
import { action, reaction, observable, when } from 'mobx';
import SafeComponent from '../shared/safe-component';
import drawerState from '../shared/drawer-state';
import uiState from '../layout/ui-state';

@observer
export default class ListWithDrawer extends SafeComponent {
    @observable timeout = null;
    @observable cachedDrawer = null;
    @observable androidExtraScrollingSpace = false;

    whenAnimationFinished() {
        return new Promise(resolve => when(() => !this.timeout, resolve));
    }

    onScrollHome = async () => {
        await this.whenAnimationFinished();
        this.scrollToStart();
    };

    componentDidMount() {
        if (!this.scrollDrawerOutOfView || !this.scrollToStart) {
            throw new Error('Must implement scrollDrawerOutOfView and scrollToStart');
        }

        uiState.subscribeTo(uiState.EVENTS.HOME, this.onScrollHome);

        this.drawerReaction = reaction(
            // context is to be set when using the list
            () => drawerState.getDrawer(),
            async drawer => {
                await this.whenAnimationFinished();
                if (this.cachedDrawer && this.cachedDrawer !== drawer) {
                    this.onHideTopDrawer();
                    await this.whenAnimationFinished();
                }
                if (drawer) {
                    // assigning and scrolling in the same render frame
                    if (!this.cachedDrawer) {
                        await this.onShowTopDrawer();
                    }
                    this.cachedDrawer = drawer;
                } else if (this.cachedDrawer) {
                    // it will clear cached drawer after end of animation
                    this.onHideTopDrawer();
                }
            },
            true
        );
    }

    componentWillUnmount() {
        this.drawerReaction();
        uiState.unsubscribe(uiState.EVENTS.HOME, this.onScrollHome);
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

    // Render top drawer but keep it out of view
    // Give it a delay then scroll down to "animate" it into view
    @action.bound
    async onShowTopDrawer() {
        if (Platform.OS === 'android') {
            this.androidExtraScrollingSpace = true;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        this.scrollDrawerOutOfView(false);
        this.timeout = setTimeout(() => {
            this.timeout = null;
            this.scrollToStart(true);
            if (Platform.OS === 'android') this.androidExtraScrollingSpace = false;
        }, 100);
    }

    // Scroll downwards to "animate" drawer out of view
    // Give it a delay, then set the correct scroll position and trigger drawer removal in drawerState
    @action.bound
    async onHideTopDrawer() {
        this.scrollDrawerOutOfView(true);
        this.timeout = setTimeout(
            action(() => {
                this.timeout = null;
                this.scrollToStart(false);
                this.cachedDrawer = null;
            }),
            500
        );
    }

    get topDrawer() {
        if (!this.cachedDrawer && !this.props.ListHeaderComponent) {
            return null;
        }
        return (
            <View>
                {this.cachedDrawer ? this.cachedDrawer.component : null}
                {this.props.ListHeaderComponent}
            </View>
        );
    }

    renderThrow() {
        throw new Error('Abstract class. Implement renderThrow for ListWithDrawer');
    }
}
