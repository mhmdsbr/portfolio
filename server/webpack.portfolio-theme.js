const path = require('path');
const { merge } = require('webpack-merge');
const config = require('./webpack.config.js');

const themeFolder = 'milimol-theme';

module.exports = merge(config, {
    entry: {
        app: path.resolve(__dirname, 'assets', 'milimol-theme', 'javascript', 'app.js'),
    },

    output: {
        path: path.resolve(__dirname, 'public', 'wp-content', 'themes', themeFolder, 'assets'),
        publicPath: `/wp-content/themes/${themeFolder}/assets/`,
    },
});
