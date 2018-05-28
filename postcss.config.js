var createResolver = require('postcss-import-webpack-resolver');
var path = require('path');

module.exports = {
    loader: 'postcss-loader',
    plugins: {
        'postcss-import': {
            resolve: createResolver({
                alias: {
                    style: path.join(__dirname, './src/style'),
                },
                modules: ['src', 'node_modules'],
            }),
        },
        'postcss-cssnext': {
            warnForDuplicates: false,
        },
        'postcss-custom-media': {
            '--phone': '(min-width: 544px)',
            '--tablet': '(min-width: 768px)',
            '--desktop': '(min-width: 992px)',
            '--large-desktop': '(min-width: 1200px)',
        },
        cssnano: {}
    }
};
