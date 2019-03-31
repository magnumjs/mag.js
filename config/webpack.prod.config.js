const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const baseConfig = require('./webpack.base.config');

const CleanPluginConfig = new CleanWebpackPlugin();

var banner = process.env.npm_package_name + ' - ' + process.env.npm_package_version + ' | ' +
    '(c)' + new Date().getFullYear() + '  ' + process.env.npm_package_author_name + ' | ' +
    process.env.npm_package_license + ' | ' +
    process.env.npm_package_homepage;

const prodBaseConfig = {
    mode: 'production',
    optimization: {
        minimize: true,
        providedExports: true,
        usedExports: true,
        sideEffects: false,
    },
    performance: {
        hints: 'warning',
        maxEntrypointSize: 300000,
        maxAssetSize: 300000
    },
    devtool: false,
    plugins: [CleanPluginConfig,new webpack.BannerPlugin(banner)]
}

const mainConfig = merge(baseConfig, {
  entry: './src/main.js',
  output: {
      library: 'mag',
      filename: 'mag.min.js',
      chunkFilename: '[name].[id].chunk.js',
      path: path.join(__dirname, '../dist'),
      publicPath: '/',
      // libraryTarget: 'umd',
      // umdNamedDefine: true
  }}, prodBaseConfig)

const useStateConfig = merge(baseConfig, {
  entry: './config/build.js',
  output: {
      library: 'mag',
      filename: 'mag.use-state.min.js',
      chunkFilename: '[name].[id].chunk.js',
      path: path.join(__dirname, '../dist'),
      publicPath: '/',
      // libraryTarget: 'umd',
      // umdNamedDefine: true
  },
  externals: {
      mag: 'mag'
  },
  }, prodBaseConfig)



// Return Array of Configurations
module.exports = [
    mainConfig, useStateConfig,
];