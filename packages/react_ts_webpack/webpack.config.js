
const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { resolve } = require('path');
const { DefinePlugin } = require('webpack');
const ENV = process.env.ENV;
const isProd = ENV === 'production';
module.exports = {
  mode: 'development', //打包为开发模式
  // 入口配置的对象中，属性为输出的js文件名，属性值为入口文件
  entry: './src/index.tsx', //入口文件,从项目根目录指定
  output: { //输出路径和文件名，使用path模块resolve方法将输出路径解析为绝对路径
    path: path.resolve(__dirname, './dist'), //将js文件打包到dist/js的目录
    filename: isProd ? '[name]/[hash].js' : '[name]/index.js'
    // filename: '[name]@[chunkhash].js'
    // filename: "js/[name]-[hash].js" //使用[name]打包出来的js文件会分别按照入口文件配置的属性来命名
  },
  devtool: 'source-map',
  resolve: { extensions: [".ts", ".tsx", ".js", ".jsx", ".json"] },
  module: {
    rules: [
      {
        test: /\.css$/,//一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
        exclude: /node_modules/,//屏蔽不需要处理的文件（文件夹）（可选）
        use:
          [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              // options: {
              //   modules: true, //开启css module
              // }
            }
          ],//loader的名称（必须）
      },
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,//一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
        exclude: /node_modules/,//屏蔽不需要处理的文件（文件夹）（可选）
        loader: 'babel-loader',//loader的名称（必须）
        options: {
          presets: ['@babel/preset-typescript', '@babel/preset-react', '@babel/preset-env'],
          plugins: ["@babel/plugin-syntax-jsx", "@babel/plugin-transform-runtime"],
          cacheDirectory: true,
        },
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin(
      {
        template: './public/index.html',
        filename: resolve('./dist/index.html'),
      }
    ),
    new MiniCssExtractPlugin()
  ],
  devServer: {
    open: true,

    historyApiFallback: true, // 不跳转
    hot: true, // 开启热更新
    // liveReload: true,
    port: 8008,
  }
};