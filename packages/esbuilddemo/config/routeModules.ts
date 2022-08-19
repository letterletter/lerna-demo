// TODO: We eventually might not want to import anything directly from `history`
// and leverage `react-router` here instead
import type { Location } from "history";
import type { ComponentType } from "react";
import type { Params } from "react-router"; // TODO: import/export from react-router-dom

import type { AppData } from "./data";
import type { LinkDescriptor } from "./links";
import type { ClientRoute, EntryRoute } from "./routes";
import type { RouteData } from "./routeData";
import type { Submission } from "./transition";

export interface RouteModules {
  [routeId: string]: RouteModule;
}

export interface RouteModule {
  CatchBoundary?: CatchBoundaryComponent;
  ErrorBoundary?: ErrorBoundaryComponent;
  default: RouteComponent;
  handle?: RouteHandle;
  links?: LinksFunction;
  meta?: MetaFunction | HtmlMetaDescriptor;
  unstable_shouldReload?: ShouldReloadFunction;
}

export type CatchBoundaryComponent = ComponentType<{}>;

export type ErrorBoundaryComponent = ComponentType<{ error: Error }>;

export interface LinksFunction {
  (): LinkDescriptor[];
}

export interface MetaFunction {
  (args: {
    data: AppData;
    parentsData: RouteData;
    params: Params;
    location: Location;
  }): HtmlMetaDescriptor | undefined;
}

/**
 * A name/content pair used to render `<meta>` tags in a meta function for a
 * route. The value can be either a string, which will render a single `<meta>`
 * tag, or an array of strings that will render multiple tags with the same
 * `name` attribute.
 */
export interface HtmlMetaDescriptor {
  charset?: "utf-8";
  charSet?: "utf-8";
  title?: string;
  [name: string]:
    | null
    | string
    | undefined
    | Record<string, string>
    | Array<Record<string, string> | string>;
}

export interface ShouldReloadFunction {
  (args: {
    url: URL;
    prevUrl: URL;
    params: Params;
    submission?: Submission;
  }): boolean;
}

/**
 * A React component that is rendered for a route.
 */
export type RouteComponent = ComponentType<{}>;

export type RouteHandle = any;

export async function loadRouteModule(
  route: EntryRoute | ClientRoute,
  routeModulesCache: RouteModules
): Promise<RouteModule> {
  if (route.id in routeModulesCache) {
    return routeModulesCache[route.id];
  }

  try {
    let routeModule = await import(/* webpackIgnore: true */ route.module);
    routeModulesCache[route.id] = routeModule;
    return routeModule;
  } catch (error) {

    window.location.reload();
    return new Promise(() => {
      // check out of this hook cause the DJs never gonna re[s]olve this
    });
  }
}
