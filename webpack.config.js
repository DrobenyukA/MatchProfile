const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require("autoprefixer");
const production = (process.env.NODE_ENV === 'production');

module.exports = {
    entry: path.resolve(__dirname, './src/js/app.js'),

    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, "./dist")
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: "babel-loader",
                exclude: /(node_modules)/

            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: production
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                sourceMap: 'inline',
                                plugins: [
                                    autoprefixer
                                ]
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: !production
                            }
                        }
                    ]
                }),
                include: path.resolve(__dirname, "./src")
            }
        ]
    },

    plugins: [

        new CleanWebpackPlugin(path.resolve(__dirname, "./dist"), {
            verbose: true,
            watch: true
        }),

        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, "./src/assets"),
                to: path.resolve(__dirname, "./dist/assets")
            }
        ]),

        new HtmlWebpackPlugin({
            title: "Match Profile",
            template: path.resolve(__dirname, "./src/html/index.ejs"),
            hash: true,
            minify: production ? {
                collapseWhitespace: true,
                html5: true,
                removeComments: true,
                removeEmptyAttributes: true
            } : false
        }),

        new ExtractTextPlugin({
            filename: 'styles/styles.css',
            disable: false,
            allChunks: true
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'common'
        })

    ],
    resolve: {
        extensions: ["*", ".js", ".jsx", ".scss"]
    }
};

if (production) {

    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false
        })
    );

} else {

    module.exports.devtool = 'inline-source-map';

    module.exports.devServer = {
        compress: false,
        contentBase: path.resolve(__dirname, "./dist"),
        open: false,
        port: process.env.PORT || 8080

    };

}