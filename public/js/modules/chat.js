import io from 'socket.io-client';
// import axios from 'axios';

function appendMessageToDOM({ name = '', message = '', node, isMe = false }) {
  const messageNode = `
    <div class="chat__message ${isMe && 'chat__message--self'}">
      <span class="chat__name">${name}</span>
      <p>${message}</p>
    </div>
  `;

  node.insertAdjacentHTML('beforeend', messageNode);
}

export default function() {
  const chatWindow = document.querySelector('#chatWindow');
  if (!chatWindow) return;

  const socket = io();

  const room = document.querySelector('input[name="channelId"]').value;
  const messageForm = document.querySelector('#messageForm');

  socket.emit('room', room);

  socket.on('message', ({ from: { name }, message }) => {
    appendMessageToDOM({ name, message, node: chatWindow });
  });
  messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const messageInput = e.target.querySelector('[name="message"]');
    const message = messageInput.value;

    appendMessageToDOM({ isMe: true, name: 'Me', message, node: chatWindow });
    socket.emit('message', message);

    messageInput.value = '';
  });
}
