import { defineConventionalRoutes } from "./config/routesFormat";
import * as path from 'path';
import { renderToString } from 'react-dom/server'
console.log(defineConventionalRoutes(path.join(__dirname, './src')))

// import Index from './config/routes/index'
// import ('./config/routes/index').then(mod => {
//   console.log(mod, 'mod', mod.default)
//   console.log(renderToString(mod.default()))
// })