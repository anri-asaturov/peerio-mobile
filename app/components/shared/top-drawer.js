import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from './safe-component';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import drawerState from './drawer-state';
import BlueButtonText from '../buttons/blue-text-button';

const container = {
    backgroundColor: 'white',
    alignItems: 'center',
    height: vars.topDrawerHeight,
    overflow: 'hidden',
    paddingBottom: vars.spacing.small.mini2x,
    borderBottomColor: vars.black12,
    borderBottomWidth: 1
};

const headingStyle = {
    paddingVertical: vars.spacing.medium.mini,
    borderBottomWidth: 1,
    borderBottomColor: vars.black12,
    alignSelf: 'stretch'
};

const headingTextStyle = {
    color: vars.darkBlue,
    textAlign: 'center'
};

const descriptionContainer = {
    marginBottom: vars.spacing.small.midi2x,
    alignSelf: 'stretch'
};

const descriptionStyle = {
    fontSize: vars.font.size12,
    color: vars.textBlack54,
    paddingHorizontal: vars.spacing.huge.mini2x,
    textAlign: 'center'
};

const iconStyle = {
    position: 'absolute',
    top: vars.spacing.small.maxi2x,
    right: vars.spacing.medium.mini2x
};

@observer
export default class TopDrawer extends SafeComponent {
    onDismiss = () => drawerState.dismiss(this);

    onButtonAction = () => {
        this.onDismiss();
        this.props.buttonAction && this.props.buttonAction();
    };

    renderThrow() {
        const { heading, image, descriptionLine1, descriptionLine2, buttonText } = this.props;
        return (
            <View style={container}>
                <View style={headingStyle}>
                    <Text semibold style={headingTextStyle}>
                        {heading}
                    </Text>
                </View>
                {image}
                <View style={descriptionContainer}>
                    <Text numberOfLines={2} style={descriptionStyle}>
                        {descriptionLine1}
                    </Text>
                    {descriptionLine2 && (
                        <Text numberOfLines={1} style={descriptionStyle}>
                            {descriptionLine2}
                        </Text>
                    )}
                </View>
                <BlueButtonText
                    text={buttonText}
                    onPress={this.onButtonAction}
                    accessibilityId={buttonText}
                />
                <View style={iconStyle}>{icons.darkNoPadding('close', this.onDismiss)}</View>
            </View>
        );
    }
}

TopDrawer.propTypes = {
    context: PropTypes.string,
    heading: PropTypes.string.isRequired,
    image: PropTypes.any.isRequired,
    descriptionLine1: PropTypes.string.isRequired,
    descriptionLine2: PropTypes.string,
    buttonText: PropTypes.string.isRequired,
    buttonAction: PropTypes.func
};
