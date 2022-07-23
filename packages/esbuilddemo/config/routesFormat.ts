import * as fs from "fs";
import * as path from "path";
import fse from "fs-extra";
import minimatch from "minimatch";
import * as esbuild from 'esbuild';
import type { FrameConfig, DefineRouteFunction, ConfigRoute, RouteManifest, DefineRouteOptions } from "../types";
import { createRouteId, findParentRouteId, byLongestFirst, createRoutePath } from "../utils/routes";

const routeModuleExts = [".js", ".jsx", ".ts", ".tsx"];

export function isRouteModuleFile(filename: string): boolean {
  return routeModuleExts.includes(path.extname(filename));
}

export function defineConventionalRoutes(appDir: string, ignoredFilePatterns?: string[]) {
  let files: { [routeId: string]: string } = {};
  visitFiles(path.join(appDir, "routes"), (file) => {
    if (
      ignoredFilePatterns &&
      ignoredFilePatterns.some((pattern) => minimatch(file, pattern))
    ) {
      return;
    }

    if (isRouteModuleFile(file)) {
      let routeId = createRouteId(path.join("routes", file));
      files[routeId] = path.join("routes", file);
      return;
    }
  });

  // Object.entries(files).forEach(([key, path]) => {
  //   getRouteModuleExports({ appDirectory: appDir, rootDirectory: ''}, path)
  // })
  let routeIds = Object.keys(files).sort(byLongestFirst);
  let uniqueRoutes = new Map<string, string>();

    // 定义嵌套路由，被defineRoutes递归调用
  function defineNestedRoutes(
    defineRoute: DefineRouteFunction,
    parentId?: string
  ): void {
    let childRouteIds = routeIds.filter(
      (id) => findParentRouteId(routeIds, id) === parentId
    );
    console.log('defineNestedRoutes', parentId, childRouteIds)
    // debugger
    for (let routeId of childRouteIds) {
      let routePath: string | undefined = createRoutePath(
        routeId.slice((parentId || "routes").length + 1)
      );

      let isIndexRoute = routeId.endsWith("/index");
      let fullPath = createRoutePath(routeId.slice("routes".length + 1));
      let uniqueRouteId = (fullPath || "") + (isIndexRoute ? "?index" : "");
      
      if (uniqueRouteId) {
        if (uniqueRoutes.has(uniqueRouteId)) {
          throw new Error(
            `Path ${JSON.stringify(fullPath)} defined by route ${JSON.stringify(
              routeId
            )} conflicts with route ${JSON.stringify(
              uniqueRoutes.get(uniqueRouteId)
            )}`
          );
        } else {
          uniqueRoutes.set(uniqueRouteId, routeId);
        }
      }
      console.log('for child defineNested) routeId , fullpath. routePath ', routeId, fullPath, routePath)
      // debugger

      if (isIndexRoute) {
        let invalidChildRoutes = routeIds.filter(
          (id) => findParentRouteId(routeIds, id) === routeId
        );

        defineRoute(routePath, files[routeId], {
          index: true,
        });
      } else {
        defineRoute(routePath, files[routeId], () => {
          defineNestedRoutes(defineRoute, routeId);
        });
      }
      
    }
  }

  return defineRoutes(defineNestedRoutes);

}
 
export function defineRoutes(
  callback: (defineRoute: DefineRouteFunction) => void
): RouteManifest {
  let routes: RouteManifest = Object.create(null);
  let parentRoutes: ConfigRoute[] = [];
  let alreadyReturned = false;

  let defineRoute: DefineRouteFunction = (
    path,
    file,
    optionsOrChildren,
    children
  ) => {
    if (alreadyReturned) {
      throw new Error(
        "You tried to define routes asynchronously but started defining " +
          "routes before the async work was done. Please await all async " +
          "data before calling `defineRoutes()`"
      );
    }

    let options: DefineRouteOptions;
    if (typeof optionsOrChildren === "function") {
      options = {};
      children = optionsOrChildren;
    } else {
      options = optionsOrChildren || {};
    }

    let route: ConfigRoute = {
      path: path ? path : undefined,
      index: options.index ? true : undefined,
      caseSensitive: options.caseSensitive ? true : undefined,
      id: createRouteId(file),
      parentId:
        parentRoutes.length > 0
          ? parentRoutes[parentRoutes.length - 1].id
          : undefined,
      file,
    };

    routes[route.id] = route;
    // debugger
    if (children) {
      parentRoutes.push(route);
      children();
      parentRoutes.pop();
    }
  };

  callback(defineRoute);

  alreadyReturned = true;
  return routes;
}

export function defineRoutesold(appDir: string, ignoredFilePatterns?: string[]) {
  let files: { [routeId: string]: string } = {};
  visitFiles(path.join(appDir, "routes"), (file) => {
    if (
      ignoredFilePatterns &&
      ignoredFilePatterns.some((pattern) => minimatch(file, pattern))
    ) {
      return;
    }

    if (isRouteModuleFile(file)) {
      let routeId = createRouteId(path.join("routes", file));
      files[routeId] = path.join("routes", file);
      return;
    }

    throw new Error(
      `Invalid route module file: ${path.join(appDir, "routes", file)}`
    );
  });
  // let res = 
  Object.entries(files).forEach(([key, path]) => {
    getRouteModuleExports({ appDirectory: appDir, rootDirectory: ''}, path)
  })
  let routeIds = Object.keys(files).sort(byLongestFirst);
  let map = new Map<string, any>();
  let uniqueRoutes = new Map<string, string>();
  function defineNestedRoutes(parentId?: string):void {
    let childRouteIds = routeIds.filter(id => findParentRouteId(routeIds, id) === parentId);

    for (let routeId of childRouteIds) {
      let routePath: string | undefined = createRoutePath(
        routeId.slice((parentId || "routes").length + 1)
      );

      let isIndexRoute = routeId.endsWith("/index");
      let fullPath = createRoutePath(routeId.slice("routes".length + 1));
      let uniqueRouteId = (fullPath || "") + (isIndexRoute ? "?index" : "");
      
      if (uniqueRouteId) {
        if (uniqueRoutes.has(uniqueRouteId)) {
          throw new Error(
            `Path ${JSON.stringify(fullPath)} defined by route ${JSON.stringify(
              routeId
            )} conflicts with route ${JSON.stringify(
              uniqueRoutes.get(uniqueRouteId)
            )}`
          );
        } else {
          uniqueRoutes.set(uniqueRouteId, routeId);
        }
      }
      console.log('for child defineNested) routeId , fullpath. routePath ', routeId, fullPath, routePath)

      if (isIndexRoute) {
        let invalidChildRoutes = routeIds.filter(
          (id) => findParentRouteId(routeIds, id) === routeId
        );

        if (invalidChildRoutes.length > 0) {
          throw new Error(
            `Child routes are not allowed in index routes. Please remove child routes of ${routeId}`
          );
        }
        console.log('index Route', routePath)
        // defineRoute(routePath, files[routeId], {
        //   index: true,
        // });
      } else {
        console.log('nextedRoutes')
        // defineRoute(routePath, files[routeId], () => {
          defineNestedRoutes(routeId);
        // });
      }
      
    }
  }

  defineNestedRoutes(undefined)
}

// function defineRoute(path, file, childrenOrFunc) {
//   let route = {
//     path,
//     file,
//     ch
//   }
// }

export function visitFiles(
  dir: string,
  visitor: (file: string) => void,
  baseDir = dir
): void {
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


export async function getRouteModuleExports(
  config: FrameConfig,
  fileName: string
): Promise<string[]> {
  let result = await esbuild.build({
    entryPoints: [
      path.resolve(config.appDirectory, fileName),
    ],
    inject: ['./react-shim.js'],
    platform: "browser",
    format: "esm",
    metafile: true,
    write: true,
    loader: {
      ".js": "jsx",
    },
    outfile: path.resolve(__dirname, fileName),
    logLevel: "silent",
  });
  console.log(result);
  console.log('filename', fileName.replace(/.(tsx|jsx|ts|js)$/, '.js'));
  fileName = fileName.replace(/.(tsx|jsx|ts|js)$/, '.js')
  // fse.ensureFile(path.resolve(__dirname, fileName)).then(() => {
  //   fse.writeFileSync(path.resolve(__dirname, fileName), result.outputFiles[0].text)
  // })

  let metafile = result.metafile!;
  for (let key in metafile.outputs) {
    let output = metafile.outputs[key];
    if (output.entryPoint) return output.exports;
  }

  throw new Error(`Unable to get exports for route ${fileName}`);
}
