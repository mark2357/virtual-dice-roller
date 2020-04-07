let path = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

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
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            favicon: 'assets/favicon.ico',
            template: path.join(parentDir, './index.html'),
        }),
        new CopyPlugin([
            // { from: 'index.html', to: 'index.html' },
            { from: 'assets/textures/skybox_sml', to: 'assets/textures/skybox_sml' },
            { from: 'assets/textures/Dice Texture.png', to: 'assets/textures/Dice Texture.png' },
            { from: 'assets/textures/Table Baked.jpg', to: 'assets/textures/Table Baked.jpg' },
            { from: 'assets/Scene.babylon', to: 'assets/Scene.babylon' },
            { from: 'assets/favicon.ico', to: 'assets/favicon.ico' },
            { from: 'assets/Scene.babylon.manifest', to: 'assets/Scene.babylon.manifest' },
        ]),
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
        new WorkboxPlugin.GenerateSW({
            // these options encourage the ServiceWorkers to get in there fast
            // and not allow any straggling "old" SWs to hang around
            clientsClaim: true,
            skipWaiting: true,
        }),
    ],
}