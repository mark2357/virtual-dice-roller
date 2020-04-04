let webpack = require('webpack');
let path = require('path');

const CopyPlugin = require('copy-webpack-plugin');

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
                test: /\.css$/,
                loaders: ["style-loader", "css-loader", "less-loader"]
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
    ],
}