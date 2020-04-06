let webpack = require('webpack');
let path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

let parentDir = path.join(__dirname, '../');

module.exports = {
    mode: 'production',
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
        path: parentDir + '/dist',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: parentDir,
        historyApiFallback: true
    },
    node: {
        fs: 'empty'
    },
    plugins: [
        new CopyPlugin([
            { from: 'index.html', to: 'index.html' },
            { from: 'assets/textures', to: 'assets/textures' },
            { from: 'assets/Scene.babylon', to: 'assets/Scene.babylon' },
            { from: 'assets/Scene.babylon.manifest', to: 'assets/Scene.babylon.manifest' },
        ]),
        new WorkboxPlugin.GenerateSW({
            // these options encourage the ServiceWorkers to get in there fast
            // and not allow any straggling "old" SWs to hang around
            clientsClaim: true,
            skipWaiting: true,
        }),
    ],
}