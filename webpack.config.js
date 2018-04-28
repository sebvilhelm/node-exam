const path = require('path');

module.exports = {
  entry: {
    App: path.resolve(__dirname, 'public/js/main.js'),
  },

  output: {
    path: path.resolve(__dirname, 'public', 'dist'),
  },
};
