const path = require('path')

module.exports = {
  resolve: {
    alias: {
      'redux-saga-create': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.json', '.jsx'],
  },
}
