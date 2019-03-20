const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const basePath = path.resolve(__dirname, 'dist');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: basePath,
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.less$/,
                use: [
                  'vue-style-loader',
                  'css-loader',
                  'less-loader'
                ]
              }
        ]
    },
    devtool: 'inline-source-map', // development
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html',
            title: 'Arcs-Graph-Layout',
            filename: 'index.html',
            inject: true
        }),
        new CleanWebpackPlugin({
            include: ['./dist/*.js']
        })
    ],
    devServer: {
        contentBase: basePath,
        compress: true,
        port: 9000
    }
};