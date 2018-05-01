import io from 'socket.io-client';

const chat = io('http://localhost:5678');

chat.on('message', ({ from, message }) => {
  console.log(from, message);
});

export default chat;
