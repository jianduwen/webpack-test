const path = require("path");
const { mode } = require("webpack-nano/argv");
const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");

const commonConfig = merge([
    {
        entry: [path.join(__dirname, "src", "mf.js")],
        output: { publicPath: "/" },
    },
    parts.loadJavaScript(),
    parts.loadImages(),
    parts.page(),
    parts.extractCSS({ loaders: [parts.tailwind()] }),
]);

const configs = {
    development: merge(
        { entry: ["webpack-plugin-serve/client"] },
        parts.devServer()
    ),
    production: {},
};

module.exports = merge(commonConfig, configs[mode], { mode });