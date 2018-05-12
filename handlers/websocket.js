module.exports = io => {
  io.on('connect', socket => {
    // authenticate
    socket.on('room', room => {
      socket.join('room');
    });
    socket.to('room').emit('message', { from: 'me', message: 'hello' });
  });
};
