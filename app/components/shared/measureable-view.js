import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';

@observer
export default class MeasureableView extends SafeComponent {
    layout = () => {
        const { onMeasure } = this.props;
        this.ref.measure(
            (frameX, frameY, frameWidth, frameHeight, pageX, pageY) => {
                onMeasure && onMeasure({
                    frameX,
                    frameY,
                    frameWidth,
                    frameHeight,
                    pageX,
                    pageY
                });
            });
    };

    setRef = ref => { this.ref = ref; };

    renderThrow() {
        return (
            <View
                {...this.props}
                onLayout={this.layout}
                ref={this.setRef}>
                {this.props.children}
            </View>
        );
    }
}
