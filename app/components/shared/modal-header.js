import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import Text from '../controls/custom-text';
import CommonHeader from './common-header';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';

@observer
export default class ModalHeader extends Component {
    render() {
        const outerStyle = [
            {
                backgroundColor: vars.darkBlueBackground15,
                marginBottom: vars.spacing.small.midi2x
            },
            this.props.outerStyle
        ];

        const textStyle = {
            textAlign: 'center',
            flexGrow: 1,
            flexShrink: 1,
            fontSize: this.props.fontSize || vars.font.size20,
            color: vars.textBlack54
        };

        const titleComponent = (
            <Text semibold style={textStyle}>
                {tx(this.props.title)}
            </Text>
        );
        const { leftIcon, rightIcon, testID } = this.props;
        return <CommonHeader {...{ titleComponent, leftIcon, rightIcon, outerStyle, testID }} />;
    }
}
