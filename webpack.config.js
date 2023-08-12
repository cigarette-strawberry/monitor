/*
 * @FileDescription: ***
 * @Author: wu0304
 * @Date: 2023-07-16 17:30:36
 * @LastEditors: wu0304
 * @LastEditTime: 2023-08-12 15:09:29
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
    // before是用来配置路由的   express服务器
    // before(router) {
    //   router.get('/success', (req, res) => {
    //     req.json({ id: 1 }) // 200
    //   })
    //   router.post('/error', (req, res) => {
    //     res.sendStatus(500) // 500
    //   })
    // }
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 插入head的js资源 默认会设置 defer
      template: './src/index.html',
      inject: 'head'
    })
  ]
}
