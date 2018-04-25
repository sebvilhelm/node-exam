// Read dotfile
require('dotenv').config();

const port = process.env.PORT || 3000;

const app = require('./app');

app.set('port', port);
app.listen(app.get('port'), () => {
  console.log(`Express is running on port ${port}`);
});
