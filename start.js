const models = require('./models');
// Read dotfile
require('dotenv').config();

const port = process.env.PORT || 3000;

const app = require('./app');

app.set('port', port);

const options = {
  force: false, // TRUE: drop existing tables if they exist
};

models.sequelize.sync(options).then(() => {
  app.listen(app.get('port'), () => {
    console.log(`Express is running on port ${port}`);
  });
});
