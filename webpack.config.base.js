import path from 'path';

export default {
  output: {
    path: path.join(__dirname, 'app'),
    filename  : 'bundle.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.js', '.json']
  },
  module: {
    rules: [
      {
        test   : /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'
        ]
      },
      {
        test: /\.(png|gif|eot|ttf|woff2?)$/,
        use: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: "url-loader?limit=10000&mimetype=image/svg+xml"
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      }
    ]
  },
  externals: [
    'sqlite3',
    'keytar'
  ]
};
