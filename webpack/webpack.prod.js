const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path');

const context = path.resolve(__dirname, '../src');
console.log('context', context);
module.exports = merge(common, {
    mode: 'production',
    module: {
        // rules: [
        //     /**
        //      * ESLINT ( -> doesn't use tslint, because it will soon be deprecated )
        //      */
        //     {
        //         enforce: 'pre',
        //         test: /\.ts$/,
        //         use: [
        //             {
        //                 // https://github.com/webpack-contrib/eslint-loader
        //                 loader: require.resolve('eslint-loader'),
        //                 options: {
        //                     // Automatically correct when possible - https://eslint.org/docs/user-guide/command-line-interface#fix
        //                     fix: false,
        //                     // Output formatter https://eslint.org/docs/user-guide/formatters/#codeframe
        //                     formatter: 'codeframe', // require('eslint-friendly-formatter') is an option too
        //                     emitError: true
        //                 },
        //             },
        //         ],
        //         exclude: [/node_modules/, /.yalc/ ],
        //     }
        // ]
    },
    plugins: [
        new ESLintPlugin({
            context: path.resolve(__dirname, '../src/'),
            overrideConfigFile: path.resolve(__dirname, '../.eslintrc.js'),
            extensions: ['.ts']
        })
    ]
});
