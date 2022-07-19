const esbuild = require('esbuild');
const serve = require('koa-static');
const path = require('path');
const koa = require('koa');
const fse = require('fs-extra');
const removeConsolePlugin = require('./plugins/removeConsole');
const aliasPlugin = require('./plugins/aliasPlugin');
import sassPlugin from './plugins/sassPlugin';
const app = new koa();

const livereload = require('livereload');
const lrServer = livereload.createServer();
lrServer.watch(__dirname + "dist");

// 使用静态服务
app.use(serve((path.join(__dirname + "/dist"))));

esbuild.build({
  entryPoints: ['src/index.tsx'],
  sourcemap: true,
  bundle: true,
  outfile: 'dist/index.js',
  plugins: [
    removeConsolePlugin(), 
    aliasPlugin({
      'configData': path.join(__dirname, 'src/config.json'),
      'src': './src'
    }),
    sassPlugin()
],
  watch: {
    onRebuild(error, result) {
      if(error) console.log('watch build failed', error);
      else {
        console.log('watch build success')
      }
    }
  }
}).then(async res => {
  const fileName = path.join(__dirname + '/dist/index.html');
  await fse.ensureFile(fileName);

  await fse.writeFileSync(fileName, `
  <!DOCTYPE html>
  <html lang="en">
   <head>
     <meta charset="UTF-8">
     <meta http-equiv="X-UA-Compatible" content="IE=edge">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>测试esbuild</title>
     <link rel="stylesheet" href="./index.css">
   </head>
   <body>
     <h1>测试esbuild</h1>
     <div id="app">  APP </div>
   </body>
   <script type="module" src="./index.js"></script>
   <script>
     document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +
     ':35729/livereload.js?snipver=1"></' + 'script>')
   </script>
   </script>
  </html>
  `);
  app.listen(3000, () => {
    console.log('local: localhost:3000')
  })
})



