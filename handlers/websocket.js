module.exports = io => {
  io.on('connect', socket => {
    // authenticate
    socket.on('room', room => {
      socket.join(room);

      socket.on('message', messageObj => {
        socket.broadcast.to(room).emit('message', messageObj);
      });
    });
  });
};
