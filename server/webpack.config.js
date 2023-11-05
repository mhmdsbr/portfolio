const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

const environment = process.env.NODE_ENV;
const isProduction = process.env.NODE_ENV === 'production';
const minify = environment === 'production';
const sourceMap = environment === 'development';

module.exports = {
    devtool: isProduction ? false : 'inline-source-map',

    mode: isProduction ? 'production' : 'development',

    module: {
        rules: [
            {
                exclude: /node_modules/,
                loader: 'babel-loader',
                test: /\.js$/,
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: !isProduction,
                            url: false,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    'postcss-import',
                                    'postcss-nested-ancestors',
                                    'postcss-nested',
                                    'postcss-pxtorem',
                                    'postcss-inline-svg',
                                    ['postcss-preset-env', {
                                        preserve: false,
                                        stage: 0,
                                    }],
                                    'postcss-sort-media-queries',
                                ],
                            },
                            sourceMap: !isProduction,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap,
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader', // Add the CSS loader here
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader', // Add a font loader if needed
                ],
            },
        ],
    },

    optimization: {
        minimizer: [
            '...',
            new CssMinimizerPlugin(),
        ],
    },

    output: {
        chunkFilename: isProduction ? 'js/[id].[chunkhash:5].js' : 'js/[id].js',
        filename: isProduction ? 'js/[name].[chunkhash:5].js' : 'js/[name].js',
    },

    plugins: [
        new CleanWebpackPlugin(),

        new MiniCssExtractPlugin({
            filename: isProduction ? 'css/[name].[contenthash:5].css' : 'css/[name].css',
        }),

        new WebpackManifestPlugin(),
    ],
};
