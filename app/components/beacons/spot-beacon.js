import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import { vars } from '../../styles/styles';
import Text from '../controls/custom-text';
import { tx } from '../utils/translator';
import AbstractBeacon from './abstract-beacon';

const windowWidth = Dimensions.get('window').width;

const MINIMUM_BUBBLE_DIAMETER = 32;

const textStyle = {
    lineHeight: vars.beaconLineHeight,
    fontSize: vars.font.size.smaller,
    color: 'white'
};

@observer
export default class SpotBeacon extends AbstractBeacon {
    get beaconHeight() {
        const { headerText, descriptionText } = this.props;
        return (
            // Header height + its padding
            (headerText ? vars.beaconLineHeight + vars.beaconPadding : 0) +
            // Description text height (taken from onLayout); is equivalent to lineHeight * numberOfLines
            (descriptionText ? this.descriptionTextHeight : 0) +
            // Container padding
            (vars.beaconPadding) +
            // Icon adds height to the container equal to half the size of the icon
            (this.bubbleDiameter / 2));
    }

    get bubbleDiameter() {
        const outerDiameter = this.props.position.frameWidth + 8 + (2 * vars.beaconBorderWidth);
        return outerDiameter >= MINIMUM_BUBBLE_DIAMETER ? outerDiameter : MINIMUM_BUBBLE_DIAMETER;
    }

    get bubblePadding() {
        return vars.beaconPadding - vars.beaconBorderWidth + this.bubbleDiameter / 2;
    }

    get contentPositionLeft() {
        return this.props.position.pageX - 2 * vars.beaconBorderWidth;
    }

    get horizontalMeasuresLeftMost() {
        return {
            containerWidth: vars.beaconWidth + (this.bubbleDiameter / 2),
            containerPositionX: { left: this.contentPositionLeft },
            circlePositionX: { left: 0 },
            rectanglePositionX: { left: this.bubbleDiameter / 2 },
            rectanglePaddingLeft: this.bubblePadding,
            rectanglePaddingRight: vars.beaconPadding
        };
    }

    get horizontalMeasuresOneThird() {
        return {
            containerWidth: vars.beaconWidth,
            containerPositionX: { left: this.contentPositionLeft - vars.beaconWidth / 3 },
            circlePositionX: { left: vars.beaconWidth / 3 },
            rectanglePositionX: { left: this.bubbleDiameter / 2 },
            rectanglePaddingLeft: vars.beaconPadding,
            rectanglePaddingRight: vars.beaconPadding
        };
    }

    get horizontalMeasuresTwoThirds() {
        return {
            containerWidth: vars.beaconWidth,
            containerPositionX: { right: windowWidth - this.contentPositionLeft - vars.beaconWidth / 3 },
            circlePositionX: { right: vars.beaconWidth / 3 - this.bubbleDiameter },
            rectanglePositionX: { right: -this.bubbleDiameter / 2 },
            rectanglePaddingLeft: vars.beaconPadding,
            rectanglePaddingRight: vars.beaconPadding
        };
    }

    get horizontalMeasuresRightMost() {
        return {
            containerWidth: vars.beaconWidth + (this.bubbleDiameter / 2),
            containerPositionX: { right: windowWidth - this.contentPositionLeft - this.bubbleDiameter },
            circlePositionX: { right: 0 },
            rectanglePositionX: { left: 0 },
            rectanglePaddingLeft: vars.beaconPadding,
            rectanglePaddingRight: this.bubblePadding
        };
    }

    // set beacon position X based on where content is with regards to the width of the screen
    get horizontalMeasures() {
        const { position } = this.props;
        if (!position) return null;

        const { pageX: x } = position;

        let measure = 'horizontalMeasuresLeftMost';
        if (x >= windowWidth / 4) measure = 'horizontalMeasuresOneThird';
        if (x >= windowWidth / 2) measure = 'horizontalMeasuresTwoThirds';
        if (x >= windowWidth * 3 / 4) measure = 'horizontalMeasuresRightMost';

        return this[measure];
    }

    get containerPositionY() {
        const { pageY, frameHeight } = this.props.position;
        return (this.isParentTop ?
            { top: pageY - (this.bubbleDiameter - frameHeight) / 2 } :
            { top: pageY - (this.beaconHeight - frameHeight / 2) }
        );
    }

    get rectanglePositionY() {
        return this.isParentTop ? { bottom: 0 } : { top: 0 };
    }

    get circlePositionY() {
        return this.isParentTop ? { top: 0 } : { bottom: 0 };
    }

    renderThrow() {
        const { position, headerText, descriptionText } = this.props;
        if (!position || !headerText && !descriptionText) return null;

        const {
            containerWidth,
            containerPositionX,
            circlePositionX,
            rectanglePositionX,
            rectanglePaddingLeft,
            rectanglePaddingRight
        } = this.horizontalMeasures;

        // set padding between bubble and text based on where the bubble is positioned
        const paddingTop = this.isParentTop ? this.bubbleDiameter / 4 : vars.beaconPadding;
        const paddingBottom = this.isParentTop ? vars.beaconPadding : this.bubbleDiameter / 4;

        const container = [containerPositionX, this.containerPositionY, {
            width: containerWidth,
            height: this.beaconHeight + (this.bubbleDiameter / 2),
            position: 'absolute'
        }];

        const rectangle = [rectanglePositionX, this.rectanglePositionY, {
            position: 'absolute',
            width: vars.beaconWidth,
            height: this.beaconHeight,
            backgroundColor: vars.beaconBg,
            borderRadius: 8,
            paddingLeft: rectanglePaddingLeft,
            paddingRight: rectanglePaddingRight,
            paddingTop,
            paddingBottom
        }];

        const outerCircle = [circlePositionX, this.circlePositionY, {
            position: 'absolute',
            width: this.bubbleDiameter,
            height: this.bubbleDiameter,
            borderRadius: this.bubbleDiameter / 2,
            borderColor: vars.beaconBg,
            borderWidth: vars.beaconBorderWidth,
            backgroundColor: vars.beaconBg,
            justifyContent: 'center',
            alignItems: 'center'
        }];

        const innerCircle = {
            position: 'relative',
            width: this.bubbleDiameter - vars.beaconBorderWidth * 2,
            height: this.bubbleDiameter - vars.beaconBorderWidth * 2,
            borderRadius: this.bubbleDiameter / 2,
            backgroundColor: this.props.spotBgColor,
            justifyContent: 'center',
            alignItems: 'center'
        };

        return (
            <View style={container} pointerEvents="box-none">
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={this.onPressContainer}
                    pressRetentionOffset={vars.pressRetentionOffset}
                    style={rectangle}>
                    {headerText && (
                        <Text bold style={[textStyle, { paddingBottom: vars.beaconPadding }]}>
                            {tx(headerText)}
                        </Text>
                    )}
                    {descriptionText && (
                        <Text semibold={!headerText} style={textStyle} onLayout={this.onDescriptionTextLayout} >
                            {tx(descriptionText)}
                        </Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={this.onPressIcon}
                    pressRetentionOffset={vars.pressRetentionOffset}
                    style={outerCircle}>
                    <View style={innerCircle}>
                        {this.props.content}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

SpotBeacon.propTypes = {
    id: PropTypes.any,
    position: PropTypes.any,
    spotBgColor: PropTypes.any,
    headerText: PropTypes.any,
    descriptionText: PropTypes.any,
    content: PropTypes.any
};
