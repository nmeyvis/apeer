const merge = require("webpack-merge");
const Webpack = require('webpack');

const common = require("./webpack.config.js");

module.exports = merge(common, {
    mode: "development",
    plugins: [
        new Webpack.DefinePlugin({
            BRANDING: {
                appName: "'APEER'"
            },
            HOSTS: {
                api: "'http://localhost:5000'",
                socket: "'http://localhost:4000'",
                tracker: "'ws://localhost:8000'"
            }
        })
    ],
    output: {
        publicPath: "//localhost:9000/static/"
    },
});