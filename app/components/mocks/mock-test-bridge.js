/* eslint-disable no-eval */
import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { observer } from 'mobx-react/native';
import Text from '../controls/custom-text';
import mockLog from './mock-log';

@observer
export default class MockTestBridge extends Component {
    componentDidMount() {
        mockLog.inject();
    }

    componentWillUnmount() {
        mockLog.free();
    }

    render() {
        return (
            <View style={{ flexGrow: 1 }}>
                <ScrollView style={{ flexGrow: 1, padding: 20 }}>
                    <Text>WS test listener bridge:</Text>
                    <Text>{mockLog.list}</Text>
                </ScrollView>
            </View>
        );
    }
}
