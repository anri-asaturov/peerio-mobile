import { User, socket } from '../../lib/icebear';

function testConfirmEmail() {
    const { username } = User.current;
    const { address } = User.current.addresses[0];
    return socket.send('/noauth/dev/address/confirm', {
        username,
        address: {
            type: 'email',
            value: address
        }
    });
}

declare const global: GlobalExtended;

global.testConfirmEmail = testConfirmEmail;

export { testConfirmEmail };
