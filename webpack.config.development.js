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
    app: ['./src/index']
  },
  output: {
    path: path.join(__dirname, 'app'),
    filename  : 'index.js',
    publicPath: `http://localhost:${port}/`
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: false
    })
  ],
  devServer: {
    port: port,
    inline: true,
    colors: true
  }
});
