import PropTypes from 'prop-types';
import React from 'react';
import { View, Image, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { observer } from 'mobx-react/native';
import { action, observable } from 'mobx';
import SafeComponent from '../shared/safe-component';
import InlineUrlPreviewConsent from '../files/inline-url-preview-consent';
import { vars } from '../../styles/styles';
import Text from '../controls/custom-text';
import icons from '../helpers/icons';
import { clientApp, util } from '../../lib/icebear';
import inlineImageCacheStore from '../files/inline-image-cache-store';
import FileTypeIcon from '../files/file-type-icon';
import { tx } from '../utils/translator';

const borderWidth = 1;

const faviconStyle = {
    width: vars.iconSizeSmall,
    height: vars.iconSizeSmall
};

const containerStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 1,
    marginLeft: 8
};

const textStyle = {
    flexGrow: 1,
    flexShrink: 1,
    fontSize: vars.font.size12
};

const nameTextStyle = [
    textStyle,
    {
        color: vars.textBlack54
    }
];

const titleTextStyle = [
    textStyle,
    {
        color: vars.peerioBlue
    }
];

const descriptionTextStyle = [
    textStyle,
    {
        color: vars.textBlack54
    }
];

const titleContainerStyle = {
    marginTop: 2
};

const descriptionContainerStyle = [
    containerStyle,
    {
        marginTop: vars.spacing.small.midi2x
    }
];

const imageSizeTextStyle = {
    fontSize: vars.font.size12,
    color: vars.textBlack54,
    marginTop: vars.spacing.small.midi2x,
    marginBottom: 8
};

@observer
export default class InlineUrlContainer extends SafeComponent {
    @observable isOpen = !this.props.isClosed;
    @observable optimalContentWidth = 0;
    @observable optimalContentHeight = 0;
    @observable errorLoadingFavIcon;

    @action.bound
    openUrl() {
        Linking.openURL(this.props.externalWebsite.url);
    }

    @action.bound
    toggleIsOpen() {
        this.isOpen = !this.isOpen;
    }

    @action.bound
    onErrorLoadingFavIcon() {
        this.errorLoadingFavIcon = true;
    }

    get favicon() {
        const { favicon, fileType } = this.props.externalWebsite;
        if (fileType) {
            return <FileTypeIcon type={fileType} size="icon" />;
        }
        return favicon && favicon.url && !this.errorLoadingFavIcon ? (
            <Image
                style={faviconStyle}
                onError={this.onErrorLoadingFavIcon}
                source={{ uri: favicon.url }}
                onPress={this.openUrl}
            />
        ) : (
            icons.darkNoPadding(
                'language',
                this.openUrl,
                { marginRight: vars.spacing.small.midi2x },
                vars.iconSizeSmall
            )
        );
    }

    get name() {
        const { url, siteName } = this.props.externalWebsite;
        let text = siteName || url;
        // if we have an image URI
        if (!text) {
            text = this.isOpen ? tx('title_collapsePreview') : tx('title_expandPreview');
        }
        return (
            <View style={containerStyle}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={nameTextStyle}>
                    {text}
                </Text>
            </View>
        );
    }

    get toggleArrowIcon() {
        return icons.darkNoPadding(
            this.isOpen ? 'arrow-drop-up' : 'arrow-drop-down',
            this.toggleIsOpen,
            { marginLeft: vars.spacing.small.midi2x }
        );
    }

    get title() {
        const { title } = this.props.externalWebsite;
        return (
            <TouchableOpacity
                pressRetentionOffset={vars.retentionOffset}
                style={titleContainerStyle}
                onPress={this.openUrl}>
                <Text numberOfLines={2} ellipsizeMode="tail" style={titleTextStyle}>
                    {title}
                </Text>
            </TouchableOpacity>
        );
    }

    get description() {
        const { description } = this.props.externalWebsite;
        if (!description) return null;
        return (
            <View style={descriptionContainerStyle}>
                <Text numberOfLines={4} ellipsizeMode="tail" style={descriptionTextStyle}>
                    {description}
                </Text>
            </View>
        );
    }

    get imageSize() {
        const { image } = this.props.externalWebsite;
        if (!image || image.length === undefined) return null;
        return (
            <Text italic style={imageSizeTextStyle}>
                {util.formatBytes(image.length)}
            </Text>
        );
    }

    get image() {
        const { image } = this.props.externalWebsite;
        if (!image) return null;
        const { url } = image;
        if (!url) return null;
        const cachedImage = inlineImageCacheStore.getImage(url);
        const { width, height } = cachedImage;
        const { optimalContentWidth, optimalContentHeight } = this;
        if (width <= 0 && height <= 0) return null;
        const dimensions = vars.optimizeImageSize(
            width,
            height,
            optimalContentWidth,
            optimalContentHeight
        );
        const imageStyle = {
            borderRadius: 2
        };
        return (
            <Image style={[dimensions, imageStyle]} source={{ uri: image.url, ...dimensions }} />
        );
    }

    onLayout = evt => {
        this.optimalContentWidth = evt.nativeEvent.layout.width - 2;
        this.optimalContentHeight = Dimensions.get('window').height;
    };

    get urlPreview() {
        const { title, description, image } = this.props.externalWebsite;
        const container = {
            marginTop: vars.spacing.small.midi2x,
            paddingTop: 8,
            paddingBottom: image ? 8 : 12, // if there's no image, text padding is 16px
            paddingHorizontal: 8,
            borderWidth,
            borderColor: vars.lightGrayBg
        };
        const headerContainer = {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: 8, // additional padding for text to equal 16
            height: 30 // same as file-inline-container
        };
        const titleDescriptionContainer = {
            paddingHorizontal: 8
        };
        const showToggleIcon = title || description || image;
        return (
            <View style={container}>
                <View style={headerContainer}>
                    {this.favicon}
                    {this.name}
                    {showToggleIcon && this.toggleArrowIcon}
                </View>
                {this.isOpen && (
                    <View>
                        <View style={titleDescriptionContainer}>
                            {this.title}
                            {this.description}
                            {this.imageSize}
                        </View>
                        <View onLayout={this.onLayout}>{this.image}</View>
                    </View>
                )}
            </View>
        );
    }

    get externalUrlConsent() {
        return (
            <InlineUrlPreviewConsent
                onChange={() => {
                    this.showUpdateSettingsLink = true;
                }}
            />
        );
    }

    renderThrow() {
        if (!clientApp.uiUserPrefs.externalContentConsented) return this.externalUrlConsent;
        if (!this.props.externalWebsite || !clientApp.uiUserPrefs.externalContentEnabled)
            return null;
        // console.log(JSON.stringify(this.props.externalWebsite));
        return this.urlPreview;
    }
}

InlineUrlContainer.propTypes = {
    externalWebsite: PropTypes.any.isRequired
};
