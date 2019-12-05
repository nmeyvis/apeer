const merge = require("webpack-merge");
const Webpack = require('webpack');

const common = require("./webpack.config.js");

module.exports = merge(common, {
    mode: "production",
    plugins: [
        new Webpack.DefinePlugin({
            BRANDING: {
                appName: "'APEER'"
            },
            HOSTS: {
                api: "'https://meyvis.dev:5000'",
                socket: "'https://meyvis.dev:4000'",
                tracker: "'wss://meyvis.dev:8000'"
            }
        })
    ],
    output: {
        publicPath: "//meyvis.dev:9000/static/"
    },
});