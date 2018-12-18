import io from 'socket.io-client/dist/socket.io';
import TestBridgeWebSocket from '../../test/listener/test-bridge-web-socket';

function createAutomationSocket() {
    return new TestBridgeWebSocket(io.connect);
}

export default createAutomationSocket;
