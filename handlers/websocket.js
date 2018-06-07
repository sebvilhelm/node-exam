const sharedSession = require('express-socket.io-session');
const session = require('./session');
const chatController = require('../controllers/chatController');
const { catchErrors } = require('./errorHandlers');

module.exports = io => {
  io.use(sharedSession(session));
  // Authentication
  io.use(catchErrors(chatController.getUser));

  io.on('connect', socket => {
    socket.on('room', room => {
      socket.join(room);

      socket.on('message', content => {
        const { id: userId } = socket.user;
        chatController
          .addMessage({ content, userId, channelId: room })
          .then(() => socket.broadcast.to(room).emit('message', { from: socket.user, content }))
          .catch(error => console.log(error));
      });
    });
  });

  // TODO: Handle unauthenticated requests
};
