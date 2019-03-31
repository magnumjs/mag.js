const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
  mode: 'development',
  devServer: {
    contentBase: './public',
    port: 3000,
    historyApiFallback: true
  }
});
