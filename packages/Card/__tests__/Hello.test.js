/**
 * @jest-environment jsdom
 */
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

import React from "react";
import { createRoot } from 'react-dom/client'
import { act } from "react-dom/test-utils";

import Hello from "../src/Hello";

let container = null;
let root = null;
beforeEach(() => {
  // 创建一个 DOM 元素作为渲染目标
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // 退出时进行清理
  container.remove();
  container = null;
  root.unmount()
});

it("渲染有或无名称", () => {
  act(() => {
    root = createRoot(container)
    root.render(<Hello />);
  });
  expect(container.textContent).toBe("嘿，陌生人");

  act(() => {
    root.render(<Hello name="Jenny" />);
  });
  expect(container.textContent).toBe("你好，Jenny！");

  act(() => {
    root.render(<Hello name="Margaret" />);
  });
  expect(container.textContent).toBe("你好，Margaret！");
});