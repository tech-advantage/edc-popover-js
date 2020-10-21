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
        // decoratorOptions.legacy = false;
        // decoratorOptions.decoratorsBeforeExport = true;
        return {
        ...options,
        // any extra options you want to set
    }},
    webpackFinal: async (config, { configType }) => {
        // Add a loader for the less files
        config.module.rules.push({
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'less-loader'],
            include: path.resolve(__dirname, '../'),
        });

        // Return the altered config
        return config;
    },

};
