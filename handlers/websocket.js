const io = require('socket.io')();

io.on('connection', socket => {
  console.log('connected');
});

module.exports = io;
