const path = require('path');

module.exports = {
    stories: [
        "../src/**/*.stories.mdx",
        "../src/**/*.stories.@(js|ts)"
    ],
    addons: [{
        name: '@storybook/addon-essentials',
        options: {
            backgrounds: true,
        }
    }],
    babel: async (options) => {
        const presetTypescript = ['@babel/preset-typescript/lib/index.js',
            {
                allowDeclareFields: true,
                onlyRemoveTypeImports: true
            }];
        options.presets.splice(1, 1, presetTypescript);
        options.plugins.unshift('babel-plugin-transform-typescript-metadata');

        const proposalClassProperty = options.plugins[3][1];
        proposalClassProperty.loose = true;
        return {
        ...options,
    }},
    webpackFinal: async (config) => {
        // Add a loader for the less files
        config.module.rules.push({
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'less-loader'],
            include: path.resolve(__dirname, '../'),
        });
        return config;
    },

};
