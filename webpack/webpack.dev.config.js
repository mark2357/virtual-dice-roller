let path = require('path');

let parentDir = path.join(__dirname, '../');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|assets)/,
                loader: 'babel-loader'
            },
            {
                test: /\.s[ac]ss$/i,
                loaders: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            }
        ]
    },
    resolve: {
        extensions: ['.jsx', '.js', '.json']
    },
    output: {
        sourceMapFilename: 'bundle.map.js',
        filename: 'bundle.js',
        path: parentDir + '/dist',
    },
    devtool: 'source-map',
    devServer: {
        host: '0.0.0.0',
        contentBase: parentDir,
        historyApiFallback: true
    },
    node: {
        fs: 'empty'
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: 'assets/favicon.ico',
            template: path.join(parentDir, './index.html'),
        }),
        new WebpackPwaManifest({
            name: 'Virtual Dice Roller',
            short_name: 'Dice Roller',
            description: 'dice rolling simulator that uses physics simulation to determine dice rolls',
            background_color: '#09C',
            theme_color:'#09C',
            crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
            display: 'standalone',
            icons: [
                {
                    src: path.resolve('assets/icon.png'),
                    sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
                },
            ]
        }),
    ],
}