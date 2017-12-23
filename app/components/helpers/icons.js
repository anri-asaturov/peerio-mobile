import React from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Jumpy from '../shared/jumpy';
import { vars } from '../../styles/styles';

const goStyle = {
    fontSize: vars.font.size.normal,
    fontWeight: vars.font.weight.semiBold,
    color: vars.bg
};

const disabledStyle = {
    fontSize: vars.font.size.normal,
    fontWeight: vars.font.weight.semiBold,
    color: vars.disabled
};

const icons = {
    basic(name, color, onPress, style, size, noPadding) {
        return (
            <TouchableOpacity
                pressRetentionOffset={vars.retentionOffset}
                onPress={onPress}>
                <View style={{ padding: noPadding ? 0 : vars.iconPadding }}>
                    <Icon
                        style={style}
                        name={name}
                        size={size || vars.iconSize}
                        color={color} />
                </View>
            </TouchableOpacity>
        );
    },

    plain(name, size, color) {
        return (
            <Icon
                name={name}
                size={size || vars.iconSize}
                color={color} />
        );
    },

    plaindark(name, size) {
        return icons.plain(name, size, vars.darkIcon);
    },

    plainalert(name, size) {
        return icons.plain(name, size, vars.txtAlert);
    },

    plainWhite(name, size) {
        return icons.plain(name, size, vars.whiteIcon);
    },

    white(name, onPress, style, size) {
        return icons.basic(name, vars.whiteIcon, onPress, style, size);
    },

    dark(name, onPress, style, size) {
        return icons.basic(name, vars.darkIcon, onPress, style, size);
    },

    gold(name, onPress, style, size) {
        return icons.basic(name, vars.gold, onPress, style, size);
    },

    darkNoPadding(name, onPress, style, size) {
        return icons.basic(name, vars.darkIcon, onPress, style, size, true);
    },

    colored(name, onPress, colorFg, backgroundColor) {
        return icons.basic(name, colorFg, onPress, backgroundColor ? { backgroundColor } : {});
    },

    coloredSmall(name, onPress, colorFg, backgroundColor) {
        return icons.basic(name, colorFg, onPress, backgroundColor ? { backgroundColor } : {}, vars.iconSizeSmall);
    },

    coloredAsText(name, color, size) {
        return <Icon name={name} size={size || vars.iconSize} color={color} />;
    },

    placeholder() {
        const d = vars.iconSize + vars.iconPadding * 2;
        const s = {
            height: d,
            width: d
        };
        return (
            <View style={s} />
        );
    },

    text(text, onPress, style) {
        const size = vars.iconPadding * 2 + vars.iconSize;
        return (
            <TouchableOpacity
                pressRetentionOffset={vars.retentionOffset}
                onPress={onPress}>
                <View style={{ height: size, width: size, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={[goStyle, style]}>{text}</Text>
                </View>
            </TouchableOpacity>
        );
    },

    disabledText(text, style) {
        const size = vars.iconPadding * 2 + vars.iconSize;
        return (
            <TouchableOpacity
                pressRetentionOffset={vars.retentionOffset} >
                <View style={{ height: size, width: size, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={[disabledStyle, style]}>{text}</Text>
                </View>
            </TouchableOpacity>
        );
    },

    bubble: (text) => icons.circle(text, 14, 8, vars.notificationIcon, vars.white),
    unreadBubble: (text) => icons.circle(text, 24, 12, vars.bg, vars.white),

    circle(text, radius, margin, bgColor, fgColor) {
        const notificationStyle = {
            backgroundColor: bgColor,
            borderRadius: radius,
            overflow: 'hidden',
            width: radius,
            height: radius,
            marginHorizontal: margin,
            alignItems: 'center',
            justifyContent: 'center'
        };
        const textStyle = {
            color: fgColor,
            fontSize: vars.font.size.normal,
            fontWeight: vars.font.weight.bold,
            textAlign: 'center'
        };
        return (
            <View style={notificationStyle}>
                <Text style={textStyle}>{`${text}`} </Text>
            </View>
        );
    },

    jumpy(icon) {
        return (
            <Jumpy>{icon}</Jumpy>
        );
    },

    iconImage(source, onPress) {
        const width = vars.iconSize;
        const height = width;
        const padding = vars.iconPadding;
        return (
            <TouchableOpacity
                style={{ padding, opacity: vars.sublteGrayOpacity }}
                onPress={onPress}
                pressRetentionOffset={vars.retentionOffset}>
                <Image style={{ width, height }} source={source} />
            </TouchableOpacity>
        );
    }
};

export default icons;
