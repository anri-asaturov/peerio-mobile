import { Image } from 'react-native';

function adjustImageDimensions(imageAsset, requestedWidth, requestedHeight) {
    const asset = Image.resolveAssetSource(imageAsset);
    let adjustedWidth = asset.width,
        adjustedHeight = asset.height;
    const aspectRatio = adjustedWidth / adjustedHeight;
    if (requestedWidth) {
        adjustedWidth = requestedWidth;
        adjustedHeight = adjustedWidth / aspectRatio;
    }

    if (requestedHeight) {
        adjustedHeight = requestedHeight;
        adjustedWidth = adjustedHeight * aspectRatio;
    }

    return {
        width: adjustedWidth,
        height: adjustedHeight
    };
}

const helpers = {
    adjustImageDimensions
};

export { adjustImageDimensions };
export default helpers;
