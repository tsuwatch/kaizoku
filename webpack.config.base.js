import path from 'path';

export default {
  output: {
    path: path.join(__dirname, 'app'),
    filename  : 'bundle.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      {
        test   : /\.js?$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  },
  externals: [
    'sqlite3',
    'keytar'
  ]
};
