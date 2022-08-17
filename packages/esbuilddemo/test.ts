import { defineConventionalRoutes } from "./config/routesFormat";
import { createBrowserBuild, generateAssetsManifest } from './config/compiler'
import * as path from 'path';
import { renderToString } from 'react-dom/server';
import type { RouteManifest } from "./types";
import { BuildResult } from "esbuild";

let conventionalRoutes = defineConventionalRoutes(path.join(__dirname, './src'));
let routes: RouteManifest = {
  root: { path: "", id: "root", file: path.resolve(__dirname, './src/index.tsx') },
};
for (let key of Object.keys(conventionalRoutes)) {
  let route = conventionalRoutes[key];
  routes[route.id] = { ...route, parentId: route.parentId || "root" };
}
// console.log('res routes', routes, conventionalRoutes);

let rootDirectory = __dirname;
let assetsBuildDirectory = path.join("public", "build");
let absoluteAssetsBuildDirectory = path.resolve(
rootDirectory,
assetsBuildDirectory
);
const config ={
  appDirectory: path.join(__dirname, './src'),
  cacheDirectory: '.cache',
  entryClientFile: path.join(__dirname, './src/index.tsx'),
  entryServerFile: '',
  devServerPort: 8888,
  // devServerBroadcastDelay: 300,
  assetsBuildDirectory: absoluteAssetsBuildDirectory,
  relativeAssetsBuildDirectory: assetsBuildDirectory,
  publicPath: path.join(__dirname, 'public/'),
  rootDirectory: '',
  routes,
  // serverBuildPath,
  // serverMode,
  // serverModuleFormat,
  // serverPlatform,
  // serverBuildTarget,
  // serverBuildTargetEntryModule,
  // serverEntryPoint: customServerEntryPoint,
  // serverDependenciesToBundle,
  // mdx,
  // watchPaths,
};
async function test() {
  let browserBuildPromise =  createBrowserBuild(config, { incremental: false,})
  browserBuildPromise.then(build => {
    generateAssetsManifest(config, build.metafile!)
  })
}
test()
