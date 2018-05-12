import io from 'socket.io-client';
import axios from 'axios';

export default function() {
  const chatWindow = document.querySelector('#chatWindow');
  if (!chatWindow) return;

  const chat = io();

  const room = document.querySelector('input[name="channelId"]').value;
  const messageForm = document.querySelector('#messageForm');

  chat.emit('room', room);

  chat.on('message', ({ from, message }) => {
    console.log(from, message);
  });

  messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const messageInput = e.target.querySelector('[name="message"]');
    const message = messageInput.value;

    axios
      .post(`/chat/${room}`, {
        message,
      })
      .then(res => console.log(res))
      .catch(err => console.error(err));
    // TODO: Send message
    messageInput.value = '';
  });
}
