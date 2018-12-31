import React, { Component } from 'react';
import { View, TouchableOpacity, NativeModules, Alert, FlatList } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, action } from 'mobx';
import stringify from 'json-stringify-safe';
import moment from 'moment';
import Text from '../controls/custom-text';
import { vars } from '../../styles/styles';
import { User, config } from '../../lib/icebear';

// uses react-native-mail module
const { RNMail } = NativeModules;

const mapFormat = ({ time, msg, color }, k) => ({
    msg: msg && (typeof msg === 'string' ? msg : stringify(msg)),
    time: moment(time).format(`HH:mm:ss.SSS`),
    k,
    key: `${time}:${k}`,
    color
});

const mapGlue = ({ msg, time }) => `${time}: ${msg}`;

@observer
export default class Logs extends Component {
    componentDidMount() {
        this.refreshInterval = setInterval(this.update, 1000);
        this.update();
    }

    componentWillUnmount() {
        clearInterval(this.refreshInterval);
    }

    @observable.shallow items = [];

    @action.bound
    update() {
        this.items = console.stack.map(mapFormat).slice();
    }

    sendLogs() {
        const subject = `Support // logs from ${User.current ? User.current.username : 'n/a'}`;
        const recipients = config.logRecipients;
        if (console.logVersion) console.logVersion();
        const body = `<pre>${console.stack
            .map(mapFormat)
            .map(mapGlue)
            .join('\n')}</pre>`;
        RNMail.mail(
            { subject, recipients, body, isHTML: true },
            error => error && Alert.alert(`Error sending logs`, error)
        );
    }

    sendButton() {
        const outer = {
            position: 'absolute',
            right: 20,
            bottom: 20
        };
        const s = {
            padding: 16,
            opacity: 0.9,
            backgroundColor: vars.darkBlue,
            borderRadius: 14
        };
        return (
            <View style={outer}>
                <TouchableOpacity
                    pressRetentionOffset={vars.retentionOffset}
                    onPress={this.sendLogs}>
                    <View style={s}>
                        <Text style={{ color: 'white' }}>Send Logs</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    flatListRef = sv => {
        this.scrollView = sv;
    };

    list() {
        return (
            <FlatList
                initialListSize={2}
                pageSize={2}
                data={this.items}
                renderItem={this.item}
                ref={this.flatListRef}
            />
        );
    }

    item({ item }) {
        const { time, msg, color, k } = item;
        return (
            <Text key={`${time}${k}`}>
                <Text style={{ color: '#666666' }}>{time}</Text>
                {': '}
                <Text style={{ color }}>{msg}</Text>
            </Text>
        );
    }

    render() {
        return (
            <View style={{ flexGrow: 1 }}>
                {this.list()}
                {this.sendButton()}
            </View>
        );
    }
}
