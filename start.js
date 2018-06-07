const app = require('./app');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { sequelize } = require('./models');
// Read dotfile
require('dotenv').config();

require('./handlers/websocket')(io);

const port = process.env.PORT || 3000;

const options = {
  force: true, // TRUE: drop existing tables if they exist
};

sequelize
  .sync(options)
  // Create global chat room, if it doesn't exist
  .then(() => sequelize.models.channel.findOrCreate({ where: { id: 1 } }))
  .then(() => {
    server.listen(port);
  })
  .catch(err => console.log("couldn't connect to database", err));

server.on('listening', () => {
  console.log(`Express is running on port ${port}`);
});

// Crash the server on unhandledRejection
// instead of failing silently
process.on('unhandledRejection', err => {
  throw err;
});
