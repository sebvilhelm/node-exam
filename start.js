const app = require('./app');
const models = require('./models');
const server = require('http').Server(app);
const io = require('./handlers/websocket');
// Read dotfile
require('dotenv').config();

const port = process.env.PORT || 3000;

const options = {
  force: false, // TRUE: drop existing tables if they exist
};

models.sequelize
  .sync(options)
  .then(() => {
    server.listen(port);
    io.listen(5678);
  })
  .catch(err => console.log("couldn't connect to database", err));

server.on('listening', () => {
  console.log(`Express is running on port ${port}`);
});
