let webpack = require('webpack');
let path = require('path');

let parentDir = path.join(__dirname, '../');

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
                test: /\.css$/,
                loaders: ["style-loader", "css-loader", "less-loader"]
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
}