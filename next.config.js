require("dotenv").config();
const webpack = require("webpack");

// const apiKey = JSON.stringify(process.env.SHOPIFY_API_KEY);
// const host = JSON.stringify(process.env.SHOPIFY_APP_URL);

module.exports = {
    webpack: (config) => {
        const env = {
            // API_KEY: apiKey,
            // HOST_URL: host
        };
        config.plugins.push(new webpack.DefinePlugin(env));
        return config;
    },
};