const knex = require('knex');
const knexConfig = require('./knexfile');
const { Model, knexSnakeCaseMappers } = require('objection');

// Read dotfile
require('dotenv').config();

// Initialize knex
const knexInit = knex({ ...knexConfig[process.env.NODE_ENV], ...knexSnakeCaseMappers() });
// Bind the models to knex
Model.knex(knexInit);

const port = process.env.PORT || 3000;

const app = require('./app');

app.set('port', port);
app.listen(app.get('port'), () => {
  console.log(`Express is running on port ${port}`);
});
