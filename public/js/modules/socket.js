import io from 'socket.io-client';

const socket = io('http://localhost:5678');

export default socket;
