import React from 'react';
import { observer } from 'mobx-react/native';
import { observable, when, reaction } from 'mobx';
import { View, Image, Text, Dimensions, LayoutAnimation, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';

class InlineImageCacheStore {
    data = {};

    async getSize(id) {
        if (this.data[id]) return this.data[id];
        // TODO
        return new Promise(resolve =>
        Image.getSize(id, (width, height) => {
            const result = { width, height };
            this.data[id] = result;
            resolve(result);
        }));
    }
}

const inlineImageCacheStore = new InlineImageCacheStore();

const DISPLAY_BY_DEFAULT = false;

@observer
export default class FileInlineImage extends SafeComponent {
    @observable width = 0;
    @observable height = 0;
    @observable optimalContentWidth = 0;
    @observable optimalContentHeight = Dimensions.get('window').height;
    @observable opened;
    @observable tooBig;
    @observable loadImage;
    outerPadding = 8;

    async componentWillMount() {
        this.opened = DISPLAY_BY_DEFAULT;
        this.tooBig = Math.random() > 0.5;
        this.loadImage = DISPLAY_BY_DEFAULT && !this.tooBig;
        when(() => this.loadImage, () => this.fetchSize());
    }

    async fetchSize() {
        const { width, height } = await inlineImageCacheStore.getSize(this.props.image);
        when(() => this.optimalContentWidth > 0, () => {
            const { optimalContentWidth, optimalContentHeight } = this;
            let w = width + 0.0, h = height + 0.0;
            if (w > optimalContentWidth) {
                h *= optimalContentWidth / w;
                w = optimalContentWidth;
            }
            if (h > optimalContentHeight) {
                w *= optimalContentHeight / h;
                h = optimalContentHeight;
            }
            this.width = Math.floor(w);
            this.height = Math.floor(h);
            console.log(this.width, this.height);
        });
    }

    componentDidMount() {
        reaction(() => this.opened, () => LayoutAnimation.easeInEaseOut());
    }

    layout = (evt) => {
        this.optimalContentWidth = evt.nativeEvent.layout.width - this.outerPadding * 2 - 2;
    }

    renderInner() {
    }

    get displayTooBigImageOffer() {
        const outer = {
            padding: this.outerPadding
        };
        const text0 = {
            color: vars.txtDark
        };
        const text = {
            color: vars.bg,
            fontStyle: 'italic',
            marginVertical: 10
        };
        return (
            <View style={outer}>
                <Text style={text0}>Images larger than 1 MB are not displayed.</Text>
                <TouchableOpacity pressRetentionOffset={vars.pressRetentionOffset} onPress={() => { this.loadImage = true; }}>
                    <Text style={text}>Display this image anyway</Text>
                </TouchableOpacity>
            </View>
        );
    }


    get displayImageOffer() {
        const text = {
            color: vars.bg,
            fontStyle: 'italic',
            textAlign: 'center',
            marginVertical: 10
        };
        return (
            <TouchableOpacity pressRetentionOffset={vars.pressRetentionOffset} onPress={() => { this.loadImage = true; }}>
                <Text style={text}>Display this image</Text>
            </TouchableOpacity>
        );
    }

    renderThrow() {
        const { url, title } = this.props.image;
        const { width, height } = this;
        const source = { uri: url };
        const outer = {
            padding: this.outerPadding,
            borderColor: vars.lightGrayBg,
            borderWidth: 1,
            marginVertical: 4
        };

        const header = {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: this.opened ? 10 : 0
        };

        const text = {
            fontWeight: 'bold',
            color: vars.txtMedium
        };

        const inner = {
            backgroundColor: vars.lightGrayBg
        };
        return (
            <View style={outer} onLayout={this.layout}>
                <View style={header}>
                    <Text style={text}>{title}</Text>
                    <View style={{ flexDirection: 'row' }}>
                        {!DISPLAY_BY_DEFAULT && icons.darkNoPadding(this.opened ? 'arrow-drop-up' : 'arrow-drop-down', () => { this.opened = !this.opened; })}
                        {icons.darkNoPadding('more-vert', () => this.props.onAction(this.props.image))}
                    </View>
                </View>
                <View style={inner}>
                    {this.opened && this.loadImage && <Image source={source} style={{ width, height }} />}
                    {this.opened && !this.loadImage && !this.tooBig && this.displayImageOffer }
                    {this.opened && !this.loadImage && this.tooBig && this.displayTooBigImageOffer }
                </View>
            </View>
        );
    }
}
