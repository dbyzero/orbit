const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const log = require('log-level');
const packageConf = require('./package');

module.exports = function (env) {
    const isProduction = env ? env.config === 'prod' : false;
    const isDevelopment = env ? env.config === 'dev' : false;

    let configuration;
    switch (true) {
        case isProduction:
            configuration = {
                VERSION: JSON.stringify(packageConf.version),
                IS_PRODUCTION: true,
                IS_DEBUG: false
            };
            break;
        case isDevelopment:
            configuration = {
                VERSION: JSON.stringify(packageConf.version),
                IS_PRODUCTION: false,
                IS_DEBUG: true
            };
            break;
        default:
            throw new Error('Unknow environment');
    }

    log.info('Using configuration:');
    log.info(configuration);

    return {
        entry: './src/index.js',
        output: {
            publicPath: '/',
            path: `${__dirname}/build/`,
            filename: 'bundle.js',
            sourceMapFilename: 'bundle.js.map'
        },
        devtool: isProduction ? 'source-map' : 'eval-source-map', //  'cheap-module-source-map'
        devServer: {
            host: 'localhost',
            contentBase: 'build/',
            // for browserHistory mode
            historyApiFallback: true
        },
        mode: isDevelopment ? 'development' : 'production',
        resolve: {
            extensions: ['.js', '.jsx']
        },
        module: {
            rules: [
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: 'html-loader',
                            options: { minimize: true }
                        }
                    ]
                },
                {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: 'babel-loader'
                        },
                        {
                            loader: 'react-svg-loader',
                            options: {
                                jsx: true // true outputs JSX tags
                            }
                        }
                    ]
                },
                {
                    test: /\.(js|jsx)$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(sass|scss|css)$/,
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                },
                {
                    test: /\.(png|jpe?g)$/,
                    loader: 'url-loader?limit=100000'
                },
                {
                    test: /\.woff$/,
                    loader: 'url-loader?limit=65000&mimetype=application/font-woff&name=fonts/[name].[ext]'
                },
                {
                    test: /\.woff2$/,
                    loader: 'url-loader?limit=65000&mimetype=application/font-woff2&name=fonts/[name].[ext]'
                },
                {
                    test: /\.[ot]tf$/,
                    loader: 'url-loader?limit=65000&mimetype=application/octet-stream&name=fonts/[name].[ext]'
                },
                {
                    test: /\.eot$/,
                    loader: 'url-loader?limit=65000&mimetype=application/vnd.ms-fontobject&name=fonts/[name].[ext]'
                }
            ]
        },
        optimization: {
            runtimeChunk: false,
            splitChunks: {
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            },
            minimize: isProduction,
            removeAvailableModules: true,
            minimizer: [
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true
                })
            ]
        },
        plugins: [
            new webpack.DefinePlugin(configuration),
            new HtmlWebPackPlugin({
                hash: true,
                template: './src/index.html',
                filename: './index.html'
            }),
            new CopyWebpackPlugin([
                {
                    from: 'src/index.css',
                    to: 'index.css'
                },
                {
                    from: 'src/locales',
                    to: 'locales'
                },
                {
                    from: 'src/assets/images/',
                    to: 'assets/images'
                },
                {
                    from: 'src/assets/sprites/',
                    to: 'assets/sprites'
                },
                {
                    from: 'src/assets/fonts/',
                    to: 'assets/fonts'
                },
                {
                    from: 'src/assets/images/favicon.png',
                    to: 'favicon.png'
                }
            ]),
            new CompressionPlugin()
        ]
    };
};
