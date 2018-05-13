const { sequelize } = require('./models');
// Read dotfile
require('dotenv').config();

const port = process.env.PORT || 3000;

const app = require('./app');

app.set('port', port);

const options = {
  force: false, // TRUE: drop existing tables if they exist
};

sequelize
  .sync(options)
  .then(() => {
    app.listen(app.get('port'), () => {
      console.log(`Express is running on port ${port}`);
    });
  })
  .catch(err => console.log("couldn't connect to database", err));

// Crash the server on unhandledRejection
// instead of failing silently
process.on('unhandledRejection', err => {
  throw err;
});
