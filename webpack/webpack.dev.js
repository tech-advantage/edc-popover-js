const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    watch: true,
    plugins: [
        new ESLintPlugin({
            context: path.resolve(__dirname, '../src/'),
            overrideConfigFile: path.resolve(__dirname, '../.eslintrc.js'),
            extensions: ['.ts']
        })
    ]
});
