const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        background: './src/background.js',
        content: './src/content.js',
        menu: './src/menu.js',
        trainingFrame: './src/trainingFrame.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {test: /\.(png|svg|jpg|gif)$/, use: 'file-loader'},
            {test: /\.css$/, use: ['style-loader', 'css-loader']},
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader",
            },
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: './static', to: './' }
        ] , {})
    ],
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    }
};