import io from 'socket.io-client';
// import axios from 'axios';

export default function() {
  const chatWindow = document.querySelector('#chatWindow');
  if (!chatWindow) return;

  const socket = io();

  const room = document.querySelector('input[name="channelId"]').value;
  const messageForm = document.querySelector('#messageForm');

  socket.emit('room', room);

  socket.on('message', ({ from, message }) => {
    console.log(from, message);
  });

  messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const messageInput = e.target.querySelector('[name="message"]');
    const message = messageInput.value;

    // TODO: Send message
    socket.emit('message', { from: 'User', message });

    messageInput.value = '';
  });
}
