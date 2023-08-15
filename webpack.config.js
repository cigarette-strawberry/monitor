/*
 * @FileDescription: ***
 * @Author: wu0304
 * @Date: 2023-07-16 17:30:36
 * @LastEditors: 吴晨
 * @LastEditTime: 2023-08-15 10:14:52
 */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    entry: './src/index.js',
    context: process.cwd(),
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'monitor.js'
    },
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        setupMiddlewares: (middlewares, devServer) => {
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined');
            }

            devServer.app.get('/success', (_, response) => {
                response.json({id: 1}) // 200
            });

            devServer.app.post('/error', (_, response) => {
                response.sendStatus(500) // 500
            });

            return middlewares;
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            // 插入head的js资源 默认会设置 defer
            template: './src/index.html',
            inject: 'head'
        })
    ]
}
