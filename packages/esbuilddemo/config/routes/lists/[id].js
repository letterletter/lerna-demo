import * as React from "react";
const data = [
  { id: 1, title: "\u5F85\u5B8C\u62101", status: "active" },
  { id: 2, title: "\u5F85\u5B8C\u62102", status: "active" },
  { id: 3, title: "\u5F85\u5B8C\u62103", status: "active" },
  { id: 4, title: "\u5DF2\u5B8C\u6210", status: "completed" }
];
function ListItem(props) {
  const { title = "\u6807\u9898", id, status } = props;
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, props.title));
}
export {
  ListItem as default
};
