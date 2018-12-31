import React from 'react';
import SignupCountryMedcryptor from './signup-country-medcryptor';
import SignupRoleMedcryptor from './signup-role-medcryptor';
import SignupStep1 from '../../signup/signup-step1';
import SignupStep2 from '../../signup/signup-step2';
import SignupStep3 from '../../signup/signup-step3';
import SignupGenerateAK from '../../signup/signup-generate-ak';
import SignupBackupAK from '../../signup/signup-backup-ak';
import SignupTermsOfUseMedcryptor from './signup-tos-mcr';
import SignupShareData from '../../signup/signup-share-data';

const signupStep1 = () => <SignupStep1 />;
const signupStep2 = () => <SignupStep2 />;
const signupStep3 = () => <SignupStep3 />;
const signupCountryMedcryptor = () => <SignupCountryMedcryptor />;
const signupRoleMedcryptor = () => <SignupRoleMedcryptor />;
const signupGenerateAK = () => <SignupGenerateAK />;
const signupBackupAK = () => <SignupBackupAK />;
const signupTermsOfUse = () => <SignupTermsOfUseMedcryptor />;
const signupShareData = () => <SignupShareData />;

const PAGES = {
    signupStep1,
    signupStep2,
    signupStep3,
    signupCountryMedcryptor,
    signupRoleMedcryptor,
    signupGenerateAK,
    signupBackupAK,
    signupTermsOfUse,
    signupShareData
};

const PAGE_NAMES = Object.keys(PAGES);
const PAGE_COMPONENTS = Object.values(PAGES);

module.exports = { PAGE_NAMES, PAGE_COMPONENTS };
