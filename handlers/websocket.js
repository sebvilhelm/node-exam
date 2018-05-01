const io = require('socket.io')();

io.on('connection', socket => {
  console.log('connected');
  socket.emit('message', { from: 'server', message: 'hello' });
});

module.exports = io;
