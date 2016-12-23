import React, { Component } from 'react';
import {
    Text,
    TouchableOpacity,
    ActivityIndicator,
    View
} from 'react-native';
import { t } from 'peerio-translator';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import * as Animatable from 'react-native-animatable';
import Circles from '../controls/circles';
import Center from '../controls/center';
import styles, { vars } from '../../styles/styles';
import Util from '../helpers/util';

@observer
export default class Pin extends Component {
    @observable message = '';
    @observable enteredPin = '';
    @observable pin = '';
    @observable isConfirm = false;
    @observable circleW = 0;
    @observable isSpinner = false;
    maxPinLength = 6;

    constructor(props) {
        super(props);
        this.layout = this.layout.bind(this);
        this.enter = this.enter.bind(this);
        this.shake = this.shake.bind(this);
    }

    componentWillMount() {
        this.initial();
    }

    check() {
        if (this.pin === this.enteredPin) {
            this.message = 'Confirmed!';
            this.props.onConfirm && this.props.onConfirm(this.enteredPin);
        } else {
            this.shake();
        }
    }

    confirm() {
        this.enteredPin = this.pin;
        this.pin = '';
        this.isConfirm = true;
        this.message = this.props.messageConfirm || t('passcode_confirm');
    }

    error(msg) {
        this.isConfirm = false;
        this.message = msg || this.props.messageWrong || t('passphrase_wrongpin');
    }

    initial() {
        this.enteredPin = '';
        this.pin = '';
        this.isSpinner = false;
        this.isConfirm = false;
        this.message = this.props.messageEnter || t('passcode_inputPlaceholder');
    }

    circle(index, text, subText) {
        const r = this.circleW || 60;
        const circle = styles.circle.create(r, {
            backgroundColor: vars.bg,
            borderColor: vars.highlight,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center'
        });
        const circleHl = styles.circle.create(r, {
            backgroundColor: vars.midlight
        });
        return (
            <View style={circleHl} key={index}>
                <TouchableOpacity onPress={() => this.enter(text)}>
                    <View style={circle}>
                        <Text style={{ color: vars.highlight, fontSize: r / 3 }}>{text}</Text>
                        <Text style={{ color: vars.midlight, fontSize: r / 6 }}>{subText}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    enter(num) {
        if (this.pin.length >= this.maxPinLength) return;
        const pin = this.pin + num;
        this.pin = pin;
        if (this.pin.length === this.maxPinLength) {
            if (this.isConfirm) {
                this.check();
            } else {
                if (this.props.preventSimplePin) {
                    if (!Util.pinEntropyCheck(this.pin)) {
                        this.shake('Not strong enough');
                        return;
                    }
                }
                const callback = this.props.checkPin || this.confirm.bind(this);
                setTimeout(() => callback(this.pin, this), 200);
            }
        }
    }

    layout(e) {
        const w = e.nativeEvent.layout.width;
        this.circleW = w / 3.6;
    }

    row(index, items) {
        const circles = items.map((i, ci) => this.circle(ci, i.text, i.subText));
        return (
            <View key={index} style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: items.length === 1 ? 'center' : 'space-between'
            }}>
                {circles}
            </View>
        );
    }

    shake(msg) {
        this.error(msg);
        this.shaker.shake(500, 5, 5);
        setTimeout(() => this.initial(), 1000);
    }

    spinner(value) {
        this.isSpinner = value;
    }

    render() {
        const style = styles.pin;
        const p = (text, subText) => ({ text, subText });
        const body = (
            <View style={{ flexGrow: 1 }}>
                <Animatable.View ref={v => { this.shaker = v; }}>
                    <Center style={style.message.container}>
                        <Text style={[style.message.text, { marginBottom: 14 }]}>
                            {this.message}
                        </Text>
                    </Center>
                </Animatable.View>
                <View style={{ height: 40 }}>
                    { this.isSpinner ?
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator color={vars.highlight} />
                        </View> :
                            <Circles count={this.maxPinLength} current={this.pin.length} fill /> }
                </View>
                <View style={{ flexGrow: 1, opacity: this.isSpinner ? 0.5 : 1 }}>
                    {this.row(0, [p(1), p(2, 'ABC'), p(3, 'DEF')])}
                    {this.row(1, [p(4, 'GHI'), p(5, 'JKL'), p(6, 'MNO')])}
                    {this.row(2, [p(7, 'PQRS'), p(8, 'TUV'), p(9, 'WXYZ')])}
                    {this.row(3, [p(0)])}
                </View>
            </View>
        );
        return (
            <View style={{
                flex: 1
            }} onLayout={this.layout}>
                {this.circleW ? body : null}
            </View>
        );
    }
}


Pin.propTypes = {
    onConfirm: React.PropTypes.func,
    checkPin: React.PropTypes.func,
    messageEnter: React.PropTypes.string,
    messageWrong: React.PropTypes.string,
    messageConfirm: React.PropTypes.string,
    preventSimplePin: React.PropTypes.bool
};
