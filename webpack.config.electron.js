import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import baseConfig from './webpack.config.base';

export default merge(baseConfig, {
  devtool: 'source-map',
  entry: ['./src/main'],
  output: {
    path: path.join(__dirname, 'app'),
    filename  : 'main.js',
  }
});
