const koa = require('koa');
const Router = require('koa-router');
const { renderToString } = require('react-dom/server');
const fs = require('fs');
const path = require('path')

import Index from './src/routes/index';


export function createRouteId(file) {
  return normalizeSlashes(stripFileExtension(file));
}

export function normalizeSlashes(file) {
  return file.split(path.win32.sep).join("/");
}

function stripFileExtension(file) {
  return file.replace(/\.[a-z0-9]+$/i, "");
}
export function visitFiles(
  dir,
  visitor,
  baseDir = dir
) {
  for (let filename of fs.readdirSync(dir)) {
    let file = path.resolve(dir, filename);
    let stat = fs.lstatSync(file);

    if (stat.isDirectory()) {
      visitFiles(file, visitor, baseDir);
    } else if (stat.isFile()) {
      visitor(path.relative(baseDir, file));
    }
  }
}

// let routeData = loadRoutes()

function loadRoutes() {
  let files = {};
  const appDir = path.join(__dirname, './config')
  visitFiles(path.join(appDir, "routes"), async (file) => {
    let routeId = createRouteId(path.join("routes", file));
      console.log('routerId', routeId, path.join( `${appDir}/routes/`, file))
      // let mod = await import(path.join( `${appDir}/routes/`, file))
    //  import(path.join( `${appDir}/routes/`, file)).then(mod => {
    //   console.log('mod', mod)
    //   files[routeId] = mod.__esModule && mod.default ? mod.default : mod;
    // })
    let RouteIndex 
    import(path.join( `${appDir}/routes/`, file)).then(mod => {
      console.log('mod', mod.default)
    })
    fs.promises.readFile(path.join( `${appDir}/routes/`, file), {encoding: 'utf-8'}).then(mod => {
      console.log('mod', typeof mod,mod)
    })

    return;
  });
  console.log('files', files)
  return files
}

function init() {
  const app = new koa();
  const router = new Router();

  // console.log('routeData', routeData)
  router.get(/\/*/, async(ctx, next) => {
    console.log(ctx.request.url);
    // const Comp = import('./routes/index.js');
    // console.log(Comp.outputFiles[0].text);
    // let content = renderToString(Comp.outputFiles[0].text);
    let content=renderToString(<Index />);
  
    ctx.body=`
    <html>
    <head>
    <title>ssr</title>
    </head>
    <body>
    <divid="root">${content}</div>
    </body>
    </html>
    `;

  })


  app.use(router.routes()).use(router.allowedMethods())

  app.listen(3333);
  console.log('3333 listening')
}
// init()

loadRoutes()