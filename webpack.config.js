var path = require('path');

module.exports = {
  entry: './exampel/es6/app.js',
  output: {
    path: path.resolve(__dirname, 'exampel'),
    publicPath: '/exampel/',
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};
