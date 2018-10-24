import { PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import fileState from '../files/file-state';
import { promiseWhen } from '../helpers/sugar';
import routes from '../routes/routes';
import { socket } from '../../lib/icebear';

const upload = async (path, fileName, extension) => {
    await promiseWhen(() => routes.main.contactStateLoaded);
    routes.main.files();
    fileState.goToRoot();

    const fileProps = {
        fileName,
        ext: extension,
        url: path
    };

    fileState.uploadInFiles(fileProps);
};

const uploadFileiOS = async (event) => {
    if (event && event.url && socket.authenticated) {
        const url = decodeURIComponent(event.url);
        const json = url.split('://')[1]; // url format: {urlScheme}://{data}
        const { files, path } = JSON.parse(json);

        const file = files[0];
        await upload(`${path}/${file}`, file, file.split('.')[1]);
    }
};

const wakeUpAndUploadFileiOS = (event) => {
    uploadFileiOS({ url: event });
};

const getStoragePermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true;
        }
    } catch (err) {
        console.warn(err);
    }
    return false;
};

const uploadFileAndroid = async (sharedFile) => {
    if (sharedFile) {
        const readPermission = await getStoragePermission();
        if (readPermission) {
            // RNFS stat now provides extra things:
            // mimeType, displayName and extension
            // for contentUri's
            const fileInfo = await RNFS.stat(sharedFile);
            // we prefer display name if it is set
            const file = fileInfo.displayName || fileInfo.originalFilepath.split('/').slice(-1).toString();
            const fileName = file.split('.')[0];
            // we fallback to mimeType determined extension if filename doesn't have one
            const ext = file.split('.')[1] || fileInfo.extension || '';
            await upload(sharedFile, fileName, ext);
        }
    }
};

module.exports = { uploadFileAndroid, uploadFileiOS, wakeUpAndUploadFileiOS };
