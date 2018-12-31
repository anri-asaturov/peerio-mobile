import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import Layout1 from '../layout/layout1';
import ModalHeader from '../shared/modal-header';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';

@observer
export default class LayoutModalExit extends SafeComponent {
    exitRow() {
        const { title, rightIcon } = this.props;
        const leftIcon = icons.dark(
            'close',
            this.props.onClose,
            undefined,
            undefined,
            'closeModal'
        );
        const fontSize = vars.font.size14;
        const outerStyle = { marginBottom: 0 };
        return <ModalHeader {...{ leftIcon, rightIcon, title, fontSize, outerStyle }} />;
    }

    lineBlock(content) {
        const s = {
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, .12)'
        };
        return <View style={s}>{content}</View>;
    }

    header() {
        return <View>{this.lineBlock(this.exitRow())}</View>;
    }

    renderThrow() {
        const header = this.header();
        const layoutStyle = {
            backgroundColor: 'white'
        };
        return (
            <Layout1
                defaultBar
                noFitHeight
                body={this.props.body}
                header={header}
                style={layoutStyle}
            />
        );
    }
}

LayoutModalExit.propTypes = {
    title: PropTypes.string,
    body: PropTypes.any,
    onClose: PropTypes.any,
    rightIcon: PropTypes.any
};
