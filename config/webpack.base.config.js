const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body'
});


module.exports = {
  name: 'app',
  entry: './src/index.js',
  output: {
    filename: 'app.bundle.js',
    chunkFilename: '[name].[id].chunk.js',
    hotUpdateChunkFilename: './.temp/[id].[hash].hot-update.js',
    path: path.join(__dirname, '../public'),
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json']
  },
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', { modules: false }] // IMPORTANT
                    ]
                }
            }
        ]
    },
  devtool: 'source-map',
  plugins: [HtmlWebpackPluginConfig]
};
