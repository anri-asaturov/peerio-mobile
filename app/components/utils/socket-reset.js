import { User, socket } from '../../lib/icebear';

function socketResetIfDead() {
    const reset = setTimeout(() => {
        socket.reset();
    }, 30000);
    socket
        .send('/noauth/auth-salt/get', { username: User.current ? User.current.username : 'test' })
        .then(response => {
            response && clearTimeout(reset);
        });
}

export default socketResetIfDead;
