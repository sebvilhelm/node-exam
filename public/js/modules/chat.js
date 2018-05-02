import io from 'socket.io-client';

const chatWindow = document.querySelector('#chatWindow');

let chat;

if (chatWindow) {
  chat = io();

  // console.log(window.location.origin);

  const room = document.querySelector('input[name="channelId"]').value;

  chat.emit('room', room);

  chat.on('message', ({ from, message }) => {
    console.log(from, message);
  });
}

export default chat;
