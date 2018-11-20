import React from 'react';
import MedcryptorAdminScreen from './medcryptor-admin-screen';
import medcryptorAdminState from './medcryptor-admin-state';
import medcryptorChatState from './medcryptor-chat-state';
import MedcryptorSpaceScreen from './medcryptor-space';
import { User } from '../../../lib/icebear';

const MEDCRYPTOR_INITIAL_ROUTE = 'medcryptorAdmin';

const extendRoutes = router => {
    if (User.current.props.mcrRoles && User.current.props.mcrRoles.some(x => x.includes('admin'))) {
        router.add(MEDCRYPTOR_INITIAL_ROUTE, [<MedcryptorAdminScreen />], medcryptorAdminState);
        router._initialRoute = MEDCRYPTOR_INITIAL_ROUTE;
    }
    router.add('space', [<MedcryptorSpaceScreen />], medcryptorChatState);
};

export default extendRoutes;
