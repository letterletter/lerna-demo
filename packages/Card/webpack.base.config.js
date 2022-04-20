
const path = require('path');

module.exports = {
  mode: 'development', //打包为开发模式
  // 入口配置的对象中，属性为输出的js文件名，属性值为入口文件
  entry: './src/index.js', //入口文件,从项目根目录指定
  output: { //输出路径和文件名，使用path模块resolve方法将输出路径解析为绝对路径
    path: path.resolve(__dirname, './dist'), //将js文件打包到dist/js的目录
    filename: 'index.js',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,//一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
        exclude: /node_modules/,//屏蔽不需要处理的文件（文件夹）（可选）
        use:
          [
            'style-loader',
            'css-loader'
          ],//loader的名称（必须）
      },
      {
        test: /\.(js|jsx)$/,//一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
        exclude: /node_modules/,//屏蔽不需要处理的文件（文件夹）（可选）
        loader: 'babel-loader',//loader的名称（必须）
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: ['@babel/plugin-syntax-jsx', '@babel/plugin-transform-runtime'],
          // cacheDirectory: true,
        },
      }
    ],
  },
  externals: [
    {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      },
      'react-dom': {
        root: 'ReactDOM',
        commonjs2: 'react-dom',
        commonjs: 'react-dom',
        amd: 'react-dom'
      }
    }
  ]
};