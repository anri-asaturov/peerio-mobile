import React from 'react';
import SignupStep1 from '../../signup/signup-step1';
import SignupStep2 from '../../signup/signup-step2';
import SignupStep3 from '../../signup/signup-step3';
import SignupGenerateAK from '../../signup/signup-generate-ak';
import SignupBackupAK from '../../signup/signup-backup-ak';
import SignupTermsOfUse from '../../signup/signup-tos';
import SignupShareData from '../../signup/signup-share-data';

const signupStep1 = () => <SignupStep1 />;
const signupStep2 = () => <SignupStep2 />;
const signupStep3 = () => <SignupStep3 />;
const signupGenerateAK = () => <SignupGenerateAK />;
const signupBackupAK = () => <SignupBackupAK />;
const signupTermsOfUse = () => <SignupTermsOfUse />;
const signupShareData = () => <SignupShareData />;

const PAGES = {
    signupStep1,
    signupStep2,
    signupStep3,
    signupGenerateAK,
    signupBackupAK,
    signupTermsOfUse,
    signupShareData
};

const PAGE_NAMES = Object.keys(PAGES);
const PAGE_COMPONENTS = Object.values(PAGES);

module.exports = { PAGE_NAMES, PAGE_COMPONENTS };
