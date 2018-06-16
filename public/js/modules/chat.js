import io from 'socket.io-client';
import format from 'date-fns/format';
import scrollToNodeBottom from './scrollToBottom';

function appendMessageToDOM({ name = '', message = { content: '', created_at: '' }, photo, node, isMe = false }) {
  const date = format(message.created_at, 'HH:mm');
  const profileImg = photo || '/images/profile-placeholder.png';
  const messageNode = `
    <div class="chat__message ${isMe && 'chat__message--self'}">
      <img class="chat__avatar" src="${profileImg}" />
      <p class="chat__meta">
        <span class="chat__name ${isMe && 'chat__name--self'}">${name}</span>
        <span class="chat__date-time">${date}</span>
      </p>
      <p class="chat__content">${message.content}</p>
    </div>
  `;

  node.insertAdjacentHTML('beforeend', messageNode);

  scrollToNodeBottom(node);
}

export default function() {
  const chatWindow = document.querySelector('#chatWindow');
  if (!chatWindow) return;

  scrollToNodeBottom(chatWindow);

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
    const message = {
      content: messageInput.value,
      created_at: new Date().toString(),
    };

    appendMessageToDOM({
      isMe: true,
      name: 'Me',
      message,
      photo: photoSelf,
      node: chatWindow,
    });
    socket.emit('message', message.content);

    messageInput.value = '';
  });
}
