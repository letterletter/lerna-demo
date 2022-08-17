import {
  React,
  init_react
} from "/Users/wufan/Code/lerna-demo/packages/esbuilddemo/public/_shared/chunk-HXXVSTCA.js";

// browser-route-module:routes/lists/[id].tsx?browser
init_react();

// src/routes/lists/[id].tsx
init_react();
function ListItem(props) {
  const { title = "\u6807\u9898", id, status } = props;
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, props.title));
}
export {
  ListItem as default
};
