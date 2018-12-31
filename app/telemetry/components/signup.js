import { telemetry } from '../../lib/icebear';
import { setup } from '../main';

const { S, duration } = telemetry;

const location = S.ONBOARDING;
const signup = setup({
    duration: tm => {
        return [
            S.DURATION,
            {
                location,
                sublocation: tm.sublocation,
                totalTime: duration(tm.startTime)
            }
        ];
    },

    durationItem: tm => {
        return [
            S.DURATION,
            {
                item: tm.item,
                location: S.ONBOARDING,
                totalTime: duration(tm.startTime)
            }
        ];
    },

    onStartAccountCreation: tm => {
        return [
            S.START_ACCOUNT_CREATION,
            {
                location,
                sublocation: tm.sublocation
            }
        ];
    },

    navigate: tm => {
        return [
            S.NAVIGATE,
            {
                option: tm.option,
                sublocation: tm.sublocation
            }
        ];
    },

    pickUsername: errorFlag => {
        return [S.PICK_USERNAME, { option: errorFlag }];
    },

    toggleNewsletterCheckbox: checked => {
        return [
            S.SET_SETTING,
            {
                option: S.RECEIVE_EMAIL,
                on: checked,
                item: S.NEWSLETTER,
                location: S.ONBOARDING
            }
        ];
    },

    copyAk: tm => {
        return [
            S.COPY,
            {
                item: S.ACCOUNT_KEY,
                sublocation: tm.sublocation
            }
        ];
    },

    saveAk: tm => {
        return [
            S.DOWNLOAD,
            {
                item: S.ACCOUNT_KEY,
                sublocation: tm.sublocation
            }
        ];
    },

    confirmSaveAk: (tm, fileType) => {
        return [
            S.DOWNLOAD_CONFIRM,
            {
                item: S.ACCOUNT_KEY,
                location: S.ONBOARDING,
                sublocation: tm.sublocation,
                fileType
            }
        ];
    },

    readMorePopup: tm => {
        return [
            S.READ_MORE,
            {
                item: tm.item,
                location: S.ONBOARDING
            }
        ];
    },

    readMoreAccordion: tm => {
        return [
            S.READ_MORE,
            {
                item: tm.item,
                location: S.ONBOARDING
            }
        ];
    },

    acceptTos: () => {
        return [S.ACCEPT_TERMS];
    },

    declineTos: () => {
        return [S.DECLINE_TERMS];
    },

    shareData: on => {
        return [
            S.SET_SETTING,
            {
                option: S.SHARE_DATA,
                on,
                item: S.CRASH_AND_ERROR_DATA,
                location: S.ONBOARDING
            }
        ];
    },

    finishSignup: () => {
        return [
            S.FINISH_ACCOUNT_CREATION,
            {
                location: S.ONBOARDING
            }
        ];
    }
});

module.exports = signup;
