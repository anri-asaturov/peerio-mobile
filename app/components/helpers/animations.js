import { LayoutAnimation, Platform } from 'react-native';

const duration = 150;
const easeInOpacity = {
    type: LayoutAnimation.Types.easeIn,
    property: LayoutAnimation.Properties.opacity
};

function transitionAnimation() {
    if (Platform.OS === 'android') return fadeInAnimation();
    return LayoutAnimation.configureNext({
        duration,
        delete: easeInOpacity,
        create: easeInOpacity,
        update: easeInOpacity
    });
}

function fadeInAnimation() {
    return LayoutAnimation.configureNext({
        duration,
        create: easeInOpacity,
        update: easeInOpacity
    });
}

function fadeOutAnimation() {
    return LayoutAnimation.configureNext({
        duration,
        delete: easeInOpacity
    });
}

export {
    transitionAnimation,
    fadeInAnimation,
    fadeOutAnimation
};
