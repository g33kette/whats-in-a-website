const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: {
        app: './src/app.js',
        // manifest: './src/manifest.json'
        // styles: './src/style.css'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {test: /\.(png|svg|jpg|gif)$/, use: 'file-loader'},
            {test: /\.css$/, use: ['style-loader', 'css-loader']},
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: './static', to: './' }
        ] , {})
    ]
};