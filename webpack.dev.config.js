var webpack             = require("webpack");
var path                = require("path");
var ExtractTextPlugin   = require("extract-text-webpack-plugin");
var ProgressBarPlugin   = require('progress-bar-webpack-plugin');
var cssHotLoader        = require('css-hot-loader');

var prodConfig = require('./webpack.config');

const stats = {
    children: false,
    colors: true,
    reasons: false,
    chunks: false,
    chunkModules: false,
    version: false,
    hash: false,
    timings: false,
};

prodConfig.stats = stats;
prodConfig.entry.index = [
    'webpack/hot/only-dev-server',
    'webpack-dev-server/client?http://localhost:8082',
    './src/js/apps/um/index',
];
prodConfig.entry.portal = [
    './src/js/apps/portal/index',
];
prodConfig.devtool = 'inline-source-map';
prodConfig.output.filename = '[name].js';
prodConfig.devServer = {
    contentBase: './public',
    hot: true,
    port: 8082,
    historyApiFallback: true,
    inline: true,
    host: '0.0.0.0',
    proxy: {
        '/api/*': {
            target: process.env.MOCK_TEST ? (process.env.MOCK_REMOTE_SERVER ||'http://online.ethx.tech:8080') : 'http://localhost:3001',
            secure: false,
        }
    }
};
prodConfig.plugins = prodConfig.plugins.slice(2).concat([
    new ExtractTextPlugin('[name].css'),
    new webpack.HotModuleReplacementPlugin(),
    new ProgressBarPlugin(),
]);

module.exports = prodConfig;
