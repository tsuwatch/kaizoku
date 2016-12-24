import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import baseConfig from './webpack.config.base';

const port = process.env.PORT || 3000;

export default merge(baseConfig, {
  debug: true,
  devtool: 'cheap-module-eval-source-map',
  entry: {
    index: './src/renderer/index',
    'login/index': './src/renderer/login/index'
  },
  output: {
    path: path.join(__dirname, 'app'),
    filename  : '[name].js',
    publicPath: `http://localhost:${port}/`
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  target: 'electron-renderer',
  devServer: {
    port: port,
    inline: true,
    colors: true
  }
});
