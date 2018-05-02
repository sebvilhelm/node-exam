module.exports = io => {
  io.on('connect', socket => {
    // authenticate
    socket.on('room', room => {
      socket.join(room);
      console.log('room', room);
    });
  });
};
