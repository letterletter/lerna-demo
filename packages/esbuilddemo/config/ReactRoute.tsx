import React from "react";
import {
  Router,
  Link as RouterLink,
  NavLink as RouterNavLink,
  useLocation,
  useRoutes,
  useNavigate,
  useHref,
  useResolvedPath,
} from "react-router-dom";
function DefaultRouteComponent({ id }: { id: string }): React.ReactElement {
  throw new Error(
    `Route "${id}" has no component! Please go add a \`default\` export in the route module file.\n` +
      "If you were trying to navigate or submit to a resource route, use `<a>` instead of `<Link>` or `<Form reloadDocument>`."
  );
}
export function RemixRoute({ id }: { id: string }) {
  let location = useLocation();
  // let { routeData, routeModules, appState } = useRemixEntryContext();


  // let data = routeData[id];
  // let { default: Component, CatchBoundary, ErrorBoundary } = routeModules[id];
  // let element = Component ? <Component /> : <DefaultRouteComponent id={id} />;

  // let context: RemixRouteContextType = { data, id };
  let element = <div>dd</div>
  return (
    // <RemixRouteContext.Provider value={context}>
      {element}
    // </RemixRouteContext.Provider>
  );
}

export class MyComp extends React.Component{
  render() {
      return(
        <div>dffsfs</div>
      )
  }
}