const whiteLabelConfig = {
    SOCIAL_SHARE_URL: 'https://medcryptor.com.au/',
    BRANDED_SENDER_ID: '367170325541',
    PRO_YEARLY_PLAN: 'com.peerio.medcryptor.messenger.professional.500.yearly',
    PRO_MONTHLY_PLAN: 'com.peerio.medcryptor.messenger.professional.500.monthly',
    PRO_MONTHLY_PRICE: '$25 AUD/month',
    PRO_YEARLY_PRICE: '$300 AUD/year',
    TERMS_URL: 'https://medcryptor.com/legal/terms-of-use',
    PRIVACY: 'https://medcryptor.com/legal/privacy-policy',
    stringReplacements: [{
        original: 'Peerio',
        replacement: 'MedCryptor'
    }],
    LOCALE_PREFIX: 'mcr_',
    SIGNUP_STEP_COUNT: 5
};

export default whiteLabelConfig;
