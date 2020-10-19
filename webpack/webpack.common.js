const path = require('path');

// Webpack plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanCSSPlugin = require('less-plugin-clean-css');

module.exports = {
    entry: './src/index.ts',
    output: {
        path: path.resolve('./dist'),
        filename: 'index.js',
        library: 'edcPopover',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: [/node_modules/, /.yalc/ ],
                use: 'ts-loader',
            },
            {
                test: /\.less|\.css$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'less-loader', // compiles Less to CSS
                        options: {
                            sourceMap: true,
                            lessOptions: {
                                plugins: [
                                    new CleanCSSPlugin({ advanced: true }),
                                ],
                            },
                        },
                    },
                ],
            },
        ]
    },
    resolve: {
        // options for resolving module requests
        // (does not apply to resolving loaders)
        modules: [
            "node_modules"
        ],
        extensions: ['.ts', '.js'],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
                filename: 'edc-popover.css',
        })
    ],
    stats: 'errors-warnings',
}
