import PropTypes from 'prop-types';
import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import Text from '../controls/custom-text';

@observer
export default class AlternatingText extends SafeComponent {
    @observable textA;
    @observable textB;
    @observable emoji;

    // Alternating text behaves like the following:
    // Get initial text to start from. Every 5 seconds, change the text to the next item in the array
    componentDidMount() {
        const { initialText, messageArray } = this.props;
        let index = Math.floor(Math.random() * messageArray.length); // random number from messageArray
        this.textA = initialText;
        this.timer = setInterval(() => {
            if (index >= messageArray.length - 1) index = 0;
            else index++;
            const currentMessage = messageArray[index];
            if (currentMessage) {
                const { message, messageB, emoji } = currentMessage;
                this.textA = message;
                this.textB = messageB;
                this.emoji = emoji;
            }
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    renderThrow() {
        const { initialText, textStyle } = this.props;
        return (
            <View>
                {this.textA !== initialText && (
                    <Text style={textStyle}>{tx('title_migrationInProgressStaticMessage')}</Text>
                )}
                <Text style={textStyle}>
                    {tx(this.textA)} {this.emoji} {tx(this.textB)}
                </Text>
            </View>
        );
    }
}

AlternatingText.propTypes = {
    initialText: PropTypes.string,
    messageArray: PropTypes.any,
    textStyle: PropTypes.any
};
