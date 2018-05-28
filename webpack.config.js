const webpack             = require("webpack");
const path                = require("path");
const HtmlWebpackPlugin   = require('html-webpack-plugin');
const FlowtypePlugin      = require("./plugins/flow-babel-webpack-plugin");
const HappyPack           = require("happypack");
const ExtractTextPlugin   = require("extract-text-webpack-plugin");
const UglifyJsPlugin      = require('uglifyjs-webpack-plugin')
const srcPath = path.join(__dirname, "./src");
const theme = require('./src/style/theme');

module.exports = {
    entry: {
        'common': ['babel-polyfill', 'react', 'redux', 'antd'],
        "index": "./src/js/apps/um/index",
        // 'font': ['./assets/font/index.css'],
    },
    output: {
        path: __dirname + "/public",
        publicPath: "/",
        filename: "[name].[hash:8].js",
    },
    module: {
        rules: [
            {
                test: /\.(scss)?$/,
                exclude: [/node_modules/],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { importLoaders: 1 } },
                        'sass-loader',                        
                        'postcss-loader',
                    ]
                }),
            },
            {
                test: /.less$/,
                loader: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
                    use: [
                        'css-loader?sourceMap!' +
                        'postcss-loader!' +
                        `less-loader?{"modifyVars":${JSON.stringify(theme)}}`
                    ]
                })),
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: 'css-loader'
                }),
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    "file-loader?hash=sha512&digest=hex&name=[path][name].[hash:8].[ext]",
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                                quality: 65
                            },
                            pngquant:{
                                quality: "65-90",
                                speed: 4
                            },
                            svgo:{
                                plugins: [
                                    {
                                        removeViewBox: false
                                    },
                                    {
                                        removeEmptyAttrs: false
                                    }
                                ]
                            }
                        }
                    }
                ],
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                use: "url-loader?limit=10000&mimetype=application/font-woff&name=[path][name].[hash:8].[ext]",
            },
            {
                test: /\.(js|jsx)?$/,
                exclude: [/node_modules/], 
                use: "happypack/loader?id=jsx",
            },
            {
                test: /\.json$/, 
                use: ['json-loader'],
            },
        ],
        noParse: [/jszip.js$/],
    },
    resolve: {
        enforceExtension: false,
        extensions: [".js", ".jsx"],
        alias: {
            actions: path.join(srcPath, '/js/actions'),
            apps: path.join(srcPath, '/js/apps'),
            components: path.join(srcPath, '/js/components'),
            constants: path.join(srcPath, '/js/constants'),
            containers: path.join(srcPath, '/js/containers'),
            reducers: path.join(srcPath, '/js/reducers'),
            routes: path.join(srcPath, '/js/routes'),
            services: path.join(srcPath, '/js/services'),
            store: path.join(srcPath, '/js/store'),
            utils: path.join(srcPath, '/js/utils'),
            locales: path.join(srcPath, '/js/locales'),
            'test-helpers': path.join(srcPath, '/js/test-helpers'),
            fixtures: path.join(srcPath, '/js/fixtures'),
            style: path.join(srcPath, '/style'),
            assets: path.join(srcPath, '/assets'),
        },
    },
    plugins: [
        new UglifyJsPlugin(),
        new ExtractTextPlugin('[name].[hash:8].css'),
        new HappyPack({
            id: "jsx",
            threads: 4,
            loaders: ["babel-loader"],
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
        }),
        new HtmlWebpackPlugin({
            template: 'src/templates/index.tpl.ejs',
            chunks: ['common', 'index', 'font'],
            chunksSortMode: function (c1, c2) {
                let orders = ['font', 'index', 'common'];
                let o1 = orders.indexOf(c1.names[0]);
                let o2 = orders.indexOf(c2.names[0]);
                return o1 - o2;
            },
            appRoot: 'app',
            filename: 'index.html',
            inject: false
        }),
        new FlowtypePlugin(),

    ]
}