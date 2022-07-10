const webpack = require('webpack');
const { mode } = require("webpack-nano/argv");
const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");
const glob = require("glob");
const cssLoaders = [
    parts.autoprefix(),
    // parts.tailwind()
];
const path = require("path");

const PATHS = {
    app: path.join(__dirname, "src"),
    build: path.join(__dirname, "dist"),
};


const commonConfig = merge([


    {
        output: {
            path: path.resolve(__dirname, "dist"),//this is the global output path control
            filename: '[name].js',
            chunkFilename: '[name].js', //this is for testing dynamic import plug-in
            publicPath: "/",
            globalObject: 'this'
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src')
            }
        },
        plugins: [

            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery"
            }),


        ],
    },
    parts.loadJavaScript({ include: PATHS.app }),
    parts.loadCSS(),
    parts.minifyJavaScript(),
    parts.minifyCSS({ options: { preset: ["default"] } }),

    // parts.extractCSS({ loaders: cssLoaders }), //This plugin extracts CSS into separate files. 
    parts.page({ title: "Demo" }),
    parts.loadImages({ limit: 25000 }),

    parts.clean(),
    parts.copyfiles(),




]);

const productionConfig = merge([
    parts.eliminateUnusedCSS(),
    parts.generateSourceMaps({ type: "source-map" }),
    parts.unusedPlugin(),
    {
        optimization: {
            // splitChunks: {
            //     // chunks: "all" 
            //     minSize: { javascript: 20000, "css/mini-extra": 10000 },

            // },
            splitChunks: { chunks: "all" },
            runtimeChunk: { name: "runtime" },
        }
    },
    { recordsPath: path.join(__dirname, "records.json") },
    {
        performance: {
            hints: "warning", // "error" or false are valid too
            maxEntrypointSize: 50000, // in bytes, default 250k
            maxAssetSize: 100000, // in bytes
        },
    },




]);


const developmentConfig = merge([
    // { entry: ["webpack-plugin-serve/client"] },
    {
        entry: {
            main: path.join(__dirname, "src"),
            style: glob.sync("./src/**/*.css"),
            hmr: [
                // Include the client code. Note host/post.
                "webpack-dev-server/client?http://localhost:8080",

                // Hot reload only when compiled successfully
                "webpack/hot/only-dev-server",

                // Alternative with refresh on failure
                // "webpack/hot/dev-server",
            ],
        },
    },
    parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT,
    }),

]);

const getConfig = (mode) => {
    switch (mode) {
        // case "prod:legacy":
        //     process.env.BROWSERSLIST_ENV = "legacy";
        //     return merge(commonConfig, productionConfig);
        // case "prod:modern":
        //     process.env.BROWSERSLIST_ENV = "modern";
        //     return merge(commonConfig, productionConfig);
        case "production":

            return merge(commonConfig, productionConfig, { mode });
        case "development":

            return merge(commonConfig, developmentConfig, { mode });
        default:
            throw new Error(`Trying to use an unknown mode, ${mode}`);
    }
};






module.exports = getConfig(mode);


