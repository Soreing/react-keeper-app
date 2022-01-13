const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: "./Frontend/src/index.js",

    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "Public")
    },

    module: {
        rules : [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "postcss-loader"
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/,
                loader: "file-loader"
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + '/Frontend/src/index.html',
            filename: 'index.html',
            inject: 'body'
        })
    ],
    devServer:{
        historyApiFallback: true
    }
}