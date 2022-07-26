const example = require.context('./config/routes',false,/\w+\.(js)$/)
example.keys().forEach(item => {
  console.log('example下的所有vue文件', item) //  item  相对路径，
  console.log(example(item).default) // example(item).default 组件，
});