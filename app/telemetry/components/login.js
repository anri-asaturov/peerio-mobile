import { telemetry } from '../../lib/icebear';
import { setup } from '../main';

const { S, duration, errorMessage } = telemetry;

const login = setup(
    {
        duration: (tm) => {
            return [
                S.DURATION,
                {
                    location: S.SIGN_IN,
                    sublocation: tm.sublocation,
                    totalTime: duration(tm.startTime)
                }
            ];
        },

        onNavigateLogin: () => {
            return [
                S.NAVIGATE, {
                    option: S.SIGN_IN,
                    location: S.ONBOARDING,
                    sublocation: S.WELCOME_SCREEN
                }
            ];
        },

        navigate: (tm) => {
            return [
                S.NAVIGATE,
                {
                    option: tm.option,
                    location: S.SIGN_IN,
                    sublocation: tm.sublocation
                }
            ];
        },

        onSigninButton: () => {
            return [
                S.SIGN_IN, {
                    option: S.MANUAL
                }];
        },

        onUserLogin: (autoLogin, hasSeenTfa) => {
            return [
                S.SIGN_IN_SUCCESS, {
                    option: autoLogin ? S.AUTO : S.MANUAL,
                    condition: hasSeenTfa ? S.TSV_ON : S.TSV_OFF
                }
            ];
        },

        onUserLoginFailed: (autoLogin) => {
            return [
                S.SIGN_IN_FAIL, {
                    option: autoLogin ? S.AUTO : S.MANUAL
                }
            ];
        },

        onUserTfaLoginFailed: (autoLogin) => {
            return [
                S.SIGN_IN_FAIL, {
                    location: S.SIGN_IN,
                    sublocation: S.TSV_DIALOG,
                    option: autoLogin ? S.AUTO : S.MANUAL,
                    condition: S.TSV_ON
                }
            ];
        },

        onLoginWithEmail: (tm, errorMsg) => {
            return [
                S.TEXT_INPUT,
                {
                    item: tm.item,
                    location: tm.location,
                    sublocation: tm.sublocation,
                    state: S.ERROR,
                    errorType: errorMessage(errorMsg)
                }
            ];
        },

        toggleAkVisibility: (isVisible) => {
            return [
                S.TOGGLE_VISIBILITY,
                {
                    location: S.SIGN_IN,
                    visible: isVisible,
                    item: S.ACCOUNT_KEY
                }
            ];
        },

        changeUser: () => {
            return [S.CHANGE_USER];
        }
    }
);

module.exports = login;
