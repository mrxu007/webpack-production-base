const {resolve} = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const webpack = require('webpack');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
//设置nodejs环境变量，让browserlist去兼容队友环境的css
process.env.NODE_ENV = 'production'
module.exports = {
  entry: './src/js/index.js',//文件入口
  // entry: {基于多入口文件配置
  //   main: '文件路径',
  //   xxx: '文件路径'
  // }
  output: {//文件输出
    filename: 'js/bundle.[contenthash:8].js',//给js后面追加hash解决后台强制缓存，重新构建打包js等文件不生效
    // filename: 'js/[name].[contenthash:8].js'  基于多入口输出配置
    path: resolve(__dirname, 'dist')
  },
  module: {//模块
    rules: [
      { //elint处理js
        enforce: 'pre',//强制这个loader比下面loader先执行，我们都知道loader从下往上，从右往左
        test: /\.js$/,
        exclude: /node_modules/,
        include: resolve(__dirname, 'src'),
        use: {
          loader: 'eslint-loader',
          options: {
            fix: true//强大的属性帮我们自动改正错误的格式！！
          }
        }
      },
      {//oneOf构建优化处理
        //每个文件都会被loader过一遍
        //使用oneOf：loader只会匹配一个类型文件
        //注意同一个类型文件，不能使用两个loader处理
        //eslint-laoder和babel-loader处理的都是js文件，所以eslint单独拿出去
        oneOf: [ 
          {//es6转esx5
            test: /\.js$/,
            exclude: /node_modules/,//依赖库不需要进行转换
            include: resolve(__dirname, 'src'),
            use: [
              /*
                开启多线程打包
                进程启动打包为600ms，进程通讯也要开销。
                只有构建时间比较长，才需要多进程打包
              */
              // {
              //   loader: 'thread-loader',
              //   options: {
              //     workers: 2//开启2个
              //   }
              // },
              {
                loader: 'babel-loader',
                options: {
                  "presets": [
                    [
                      '@babel/preset-env',
                      {
                        //按需加载
                        useBuiltIns: 'usage',
                        //指定core-js版本
                        corejs: {
                          version: 3
                        },
                        //指定兼容性做到那些版本浏览器
                        targets: {
                          chrome: '60',
                          firefox: '60',
                          ie: '9',
                          safari: '10',
                          edge: '17'
                        }
                      }
                    ] 
                  ],
                  //开启babel缓存
                  //第二次构建时，会读取之前的缓存，提高速度
                  cacheDirectory: true
                }
              }
            ]
          },
          {//处理文字图片
            test: /\.(eot|svg|ttf|woff|woff2)$/,
            exclude: resolve(__dirname,'src/images'),
            include: resolve(__dirname, 'src/font'),
            use: {
              loader: 'file-loader',
              options: {
                name: '[hash:8].[ext]',
                outputPath: 'font/'
              }
            }
          },
          {//处理html中的img图片
            test: /\.html$/,
            use: [
              {
                loader: 'html-loader'
                //识别html文件中的img标签
              }
            ]
          },
          {//处理import导入的图片
            test: /\.(gif|png|jpeg|svg|jpg)$/,
            exclude: resolve(__dirname, 'src/font'),
            include: resolve(__dirname, 'src/images'),
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 8 * 1024,//用于base64转换，base64图片不会请求http，减少小体积图片的请求。
                  //大于这个限制的图片使用依赖file-loader解析图片
                  outputPath: 'images/',
                  publicPath: '../../dist/images',
                  //因为打包后抽离插件的影响，css中所引用的图片相对地址发生了改变，所以要设置这项
                  name: '[hash:8].[ext]'
                }
              }
            ]
          },
          {//处理styl文件
            test: /\.styl/,
            use: [
              // 'style-loader',
              MiniCssExtractPlugin.loader,
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-preset-env')
                    //帮助postcss-loader去找package.json文件中的browserlist兼容主流浏览器配置
                  ]
                }
              },
              'stylus-loader'
            ]
          },
          {//处理less
            test: /\.less$/,
            use: [
              // 'style-loader',
              MiniCssExtractPlugin.loader,
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-preset-env')
                    //帮助postcss-loader去找package.json文件中的browserlist兼容主流浏览器配置
                  ]
                }
              },
              'less-loader'
            ]
          },
          {//处理css
            test: /\.css$/,
            use:[
              // 'style-loader', 
              MiniCssExtractPlugin.loader,
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-preset-env')
                    //帮助postcss-loader去找package.json文件中的browserlist兼容主流浏览器配置
                  ]
                }
              }
            ]
          }
        ]
      }
    ]
  },
  plugins: [//插件
    new CleanWebpackPlugin(),//清楚上一个打包的文件残留
    new HtmlWebpackPlugin({//html文件处理
      template: './src/index.html',//模板文件
      filename: 'index.html',//打包后的名字
      // html上线优化设置
      minify: {//压缩
        removeAttributeQuotes: true,//移除属性之间的引号
        collapseWhitespace: true,//折叠空格
      },
      hash: true//插入的js尾部生成hash戳
    }),
    new MiniCssExtractPlugin({//css抽离
      //对输出的css文件进行分、重命名
      filename: 'css/bundle.[contenthash:8].css', 
    }),
    new OptimizeCssAssetsWebpackPlugin(),//css代码压缩

    new webpack.DllReferencePlugin({//告诉webpack那些库不参与打包，使用时查找映射文件里的库
      manifest: resolve(__dirname, 'dll/manifest.json')
    }),
    //引入某个库打包输出出去，并在html中自动引入该资源
    new AddAssetHtmlWebpackPlugin({
      filepath: resolve(__dirname, 'dll/jquery.js')
    }),
    new WorkboxWebpackPlugin.GenerateSW({    //离线缓存技术
      // 帮助serviceworker快速启动
      // 删除旧的serviceworker
      // 生成serviceWorker文件
      clientsClaim: true,
      skipWaiting:true
    })
  ],
  mode: 'production',//运行模式
  // mode: 'development',
  // devtool: 'source-map',//映射源代码/，用于上线环境的调试
  // externals: {externals用于不打包由外部连接引入的第三方库例如JQuery，vue等
  //   jquery: 'jquery'
  // },
  optimization: {//1.将/node_modules/的文件单独打包成一个chunk最终输出             //2.也可以分析多入口文件中引入相同的库，文件，单独抽离出来，避免了重复打包 
    splitChunks : {
      chunks: 'all'
    }
  }
  /**
   * 使用dll技术，对某些库(第三方库：jquery、react、vue)进行单独打包
   * 详情请看webpack.dll.js配置
   */
  // devServer: {//本地运行服务器配置
  //   contentBase: resolve(__dirname, 'dist'),//解析文件地址
  //   compress: true,//打开gzip压缩
  //   port: 8000,//端口号
  //   open: true,//自动打开浏览器
  //   //生产环境没有devServer
  //   // hot: true//只能开发环境下开启，生产环境不能开启HMR功能谨记
  // }
}