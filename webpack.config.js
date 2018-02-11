const webpack = require('webpack');
const WriteFilePlugin = require('write-file-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');
const os = require('os');
const packageConf = require('./package');

module.exports = function (env) {
    const isProduction = env ? env.config === 'prod' : false;
    const isDevelopment = env ? env.config === 'dev' : false;

    let configuration;
    switch (true) {
        case isProduction:
            configuration = {
                VERSION: JSON.stringify(packageConf.version),
                IS_PRODUCTION: true
            };
            break;
        case isDevelopment:
            configuration = {
                VERSION: JSON.stringify(packageConf.version),
                IS_PRODUCTION: false
            };
            break;
        default:
            throw new Error('Unknow environment');
    }

    console.log('Using configuration:');
    console.log(configuration);

    return {
        entry: './src/js/app.jsx',
        output: {
            path: __dirname + '/build/',
            filename: 'app.js',
            sourceMapFilename: 'app.js.map'
        },
        devtool: isProduction ? 'source-map' : 'eval',
        devServer: {
            host: '0.0.0.0',
            contentBase: 'build/',
            // for browserHistory mode
            historyApiFallback: true
        },
        module: {
            loaders: [
                {
                    test: /.jsx?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: ['react', 'es2015']
                    }
                },
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                },
                {
                    test: /\.s?css$/,
                    loaders: [{
                        loader: 'style-loader'
                    }, {
                        loader: 'css-loader'
                    }, {
                        loader: 'sass-loader',
                        options: {
                            includePaths: [
                                'node_modules/foundation-sites/scss/'
                            ]
                        }
                    }]
                },
                {
                    test: /\.(png|jpe?g)$/,
                    loader: 'url-loader?limit=20000'
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
        plugins: [
            new webpack.DefinePlugin(configuration),
            new WriteFilePlugin(),
            new CopyWebpackPlugin([
                {
                    from: 'src/index.html',
                    to: 'index.html'
                },
                {
                    from: 'src/locales',
                    to: 'locales'
                },
                {
                    from: 'src/css',
                    to: 'css'
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
            new webpack.optimize.UglifyJsPlugin({
                minimize: isProduction,
                compress: isProduction,
                mangle: isProduction,
                beautify: !isProduction,
                sourceMap: true
            }),
            new WebpackShellPlugin({
                onBuildEnd: 'node scripts/build/end.js'
            })
        ]
    };
};
