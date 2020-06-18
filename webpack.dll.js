/**
 * 使用dll技术，对某些库(第三方库：jquery、react、vue)进行单独打包
 * 当运行webpack命令是，默认查找的是webpack.config.js
 * --> webpack --config webpack.dll.js
 */
const {resolve} = require('path');
const webpack = require('webpack');
module.exports = {
  entry: {
    //最终打包生成[name] --> jquery
    //['jquery'] --> 要打包的库是jquery
    jquery: ['jquery']
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dll'),
    library: '[name]_[hash]'//打包的库向外暴露出去的内容叫什么名字
  },
  plugins: [
    //打包生成一个manifast.json ---> 提供的是库的映射文件
    new webpack.DllPlugin({
      name: '[name]_[hash]',//映射的库的名称
      path: resolve(__dirname, 'dll/manifest.json')
    })
  ],
  mode: 'production'
}