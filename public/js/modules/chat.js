import io from 'socket.io-client';
// import axios from 'axios';

function appendMessageToDOM({ name = '', message = '', photo, node, isMe = false }) {
  const messageNode = `
    <div class="chat__message ${isMe && 'chat__message--self'}">
      <img class="chat__avatar" src="${photo}" aria-hidden="true" /> <span class="chat__name ${isMe &&
    'chat__name--self'}">${name}</span>
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
  const photoSelf = document.querySelector('.avatar').src;

  socket.emit('room', room);

  socket.on('message', ({ from: { name, photo }, message }) => {
    appendMessageToDOM({ photo, name, message, node: chatWindow });
  });
  messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const messageInput = e.target.querySelector('[name="message"]');
    const message = messageInput.value;

    appendMessageToDOM({ isMe: true, name: 'Me', message, photo: photoSelf, node: chatWindow });
    socket.emit('message', message);

    messageInput.value = '';
  });
}
