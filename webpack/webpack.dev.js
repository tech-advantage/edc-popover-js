const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    watch: false, // There's an issue going on with webpack 5 and watch, waiting for a fix
    // https://github.com/webpack/webpack-cli/issues/1918#issuecomment-707765497
    watchOptions: {
        aggregateTimeout: 600
    }
});
