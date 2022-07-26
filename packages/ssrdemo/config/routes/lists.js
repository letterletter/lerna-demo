import * as React from "react";
const data = [
  { id: 1, title: "\u5F85\u5B8C\u62101", status: "active" },
  { id: 2, title: "\u5F85\u5B8C\u62102", status: "active" },
  { id: 3, title: "\u5F85\u5B8C\u62103", status: "active" },
  { id: 4, title: "\u5DF2\u5B8C\u6210", status: "completed" }
];
function getData() {
  return "data";
}
function List() {
  return /* @__PURE__ */ React.createElement("div", null, "Hello Demo!", data.map((item) => /* @__PURE__ */ React.createElement("div", null, item.title, " --- ", item.status)));
}
export {
  List as default,
  getData
};
