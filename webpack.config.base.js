import path from 'path';

export default {
  output: {
    path: path.join(__dirname, 'app'),
    filename  : 'bundle.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['', '.js', 'jsx']
  },
  module: {
    loaders: [{
      test   : /\.jsx?$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/
    }]
  }
};
