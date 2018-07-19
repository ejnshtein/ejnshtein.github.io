/* eslint-disable no-undef */
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin')

module.exports = {
    mode: 'development',
    //devtool: "cheap-module-source-map",
    entry: {
        'index': './app/js/index.js',
    },

    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd',
        libraryExport: 'default',
        umdNamedDefine: true,
        publicPath: '/'
    },

    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.scss']
    },

    module: {
        strictExportPresence: true,
        rules: [{
                test: /\.js$/,
                enforce: 'pre',
                loader: 'eslint-loader'
            },
            {
                test: /\.scss$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '../dist/css'
                        }
                    },
                    {
                        loader: 'css-loader?url=false',
                        options: {
                            importLoaders: 1,
                            minimize: true,
                            url: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            config: {
                                path: path.join(__dirname, 'postcss.config.js')
                            }
                        }
                    },
                    'sass-loader'
                ]
            }
        ]
    },

    devServer: {
        index: 'index.html',
        open: true,
        hot: true,
        port: 80,
        compress: true,
        contentBase: path.resolve(__dirname,'..')
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new WriteFileWebpackPlugin({
            test: /^(?!.*(hot)).*/
        }),
        new webpack.HotModuleReplacementPlugin()
    ],

    node: {
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }

};