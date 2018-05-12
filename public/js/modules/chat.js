import io from 'socket.io-client';

export default function() {
  const chatWindow = document.querySelector('#chatWindow');

  if (!chatWindow) return;

  const chat = io();

  const room = document.querySelector('input[name="channelId"]').value;

  chat.emit('room', room);

  chat.on('message', ({ from, message }) => {
    console.log(from, message);
  });
}
