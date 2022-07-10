// const { WebpackPluginServe } = require("webpack-plugin-serve");
const { HotAcceptPlugin } = require('hot-accept-webpack-plugin');
const { MiniHtmlWebpackPlugin } = require("mini-html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const glob = require("glob");
const PurgeCSSPlugin = require("purgecss-webpack-plugin");
const ALL_FILES = glob.sync(path.join(__dirname, "src/*.js"));
const APP_SOURCE = path.join(__dirname, "src");
const CopyPlugin = require("copy-webpack-plugin");
exports.generateSourceMaps = ({ type }) => ({ devtool: type });
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const UnusedWebpackPlugin = require('unused-webpack-plugin');
const webpack = require('webpack');
exports.unusedPlugin = () => ({
    plugins: [
        new UnusedWebpackPlugin({
            // Source directories
            directories: [path.join(__dirname, 'src')],
            // Exclude patterns
            exclude: ['*.test.js'],
            // Root directory (optional)
            root: __dirname,
        }),
    ]
});


exports.tailwind = () => ({
    loader: "postcss-loader",
    options: {
        postcssOptions: { plugins: [require("tailwindcss")()] },

    },
});

exports.eliminateUnusedCSS = () => ({
    plugins: [
        new PurgeCSSPlugin({
            paths: ALL_FILES, // Consider extracting as a parameter
            extractors: [
                {
                    extractor: (content) =>
                        content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [],
                    extensions: ["html"],
                },
            ],
        }),
    ],
});

exports.autoprefix = () => ({
    loader: "postcss-loader",
    options: {
        postcssOptions: { plugins: [require("autoprefixer")()] },
    },
});
exports.loadImages = ({ limit } = {}) => ({
    module: {
        rules: [
            {
                test: /\.(png|jpg|svg|gif)$/,
                type: "asset",
                parser: { dataUrlCondition: { maxSize: limit } },
            },
        ],
    },
});

exports.devServer = ({ host, port }) => ({
    // watch: true,
    devServer: {
        host: '0.0.0.0',
        port: 8080, // Defaults to 8080
        open: true,
        hotOnly: true,
    },
    devtool: 'eval-source-map',

    plugins: [
        new webpack.HotModuleReplacementPlugin({}),
        // new HotAcceptPlugin({
        //     test: /index\.js$/
        // })
        // new WebpackPluginServe({
        //     port: process.env.PORT || 8080,
        //     static: "./dist", // Expose if output.path changes
        //     liveReload: true,
        //     waitForBuild: true,
        // })
    ],
});


exports.loadCSS = ({ include, exclude } = {}) => ({
    module: {
        rules: [
            {
                test: /\.css$/,
                include,
                exclude,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                        },
                    }
                ],

            },

            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "style-loader", // creates style nodes from JS strings

                    },
                    {
                        loader: "css-loader", // translates CSS into CommonJS
                        options: {
                            minimize: true,
                            importLoaders: 2,
                            modules: true,
                        }
                    },
                    {
                        loader: "sass-loader" // compiles Sass to CSS
                    }
                ]
            }
        ],
    },
});



exports.extractCSS = ({ options = {}, loaders = [] } = {}) => {
    return {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader, options
                        },
                        "css-loader",

                    ].concat(loaders),
                    sideEffects: true,
                },
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].[contenthash:4].css',
            }),
        ],
    };
};



exports.loadJavaScript = () => ({
    module: {
        rules: [
            // Consider extracting include as a parameter
            {
                test: /\.js$/,
                include: APP_SOURCE,
                resolve: {
                    extensions: [".js", ".jsx"],

                },
                use: "babel-loader",

            },

        ],
    },
});


exports.clean = () => ({
    output: {
        clean: true,
    },
});

exports.copyfiles = () => ({
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: 'src/images', to: 'images' },
            ],
        }),
    ],
});

exports.minifyJavaScript = () => ({
    optimization: { minimizer: [new TerserPlugin()] },
});



exports.page = ({ title, url = "", chunks } = {}) => ({
    plugins: [
        new MiniHtmlWebpackPlugin({
            publicPath: "/",
            chunks,
            filename: `${url && url + "/"}index.html`,
            context: { title },
        }),
    ],
});

exports.minifyCSS = ({ options }) => ({
    optimization: {
        minimizer: [
            new CssMinimizerPlugin({ minimizerOptions: options }),
        ],
    },
});


exports.setFreeVariable = (key, value) => {
    const env = {};
    env[key] = JSON.stringify(value);

    return {
        plugins: [new webpack.DefinePlugin(env)],
    };
};