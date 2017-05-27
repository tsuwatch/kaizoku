import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import baseConfig from './webpack.config.base';

export default merge(baseConfig, {
  entry: {
    index: './src/renderer/index.js',
    'login/index': './src/renderer/login/index.js'
  },
  output: {
    path: path.join(__dirname, 'app'),
    filename  : '[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'login/index.html',
      template: 'src/renderer/login/index.html',
      inject: false
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/renderer/index.html',
      inject: false
    })
  ],
  target: 'electron-renderer'
});
