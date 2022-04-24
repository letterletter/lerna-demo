'use strict';
/**
 * @jest-environment jsdom
 */
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

import React from "react";
import { createRoot } from 'react-dom/client'
import { act } from "react-dom/test-utils";


import Card from "../src/CardTimeout";

let container = null;
let root = null;
beforeEach(() => {
  // 创建一个 DOM 元素作为渲染目标
  container = document.createElement("div");
  document.body.appendChild(container);
  jest.useFakeTimers();
});

afterEach(() => {
  // 退出时进行清理
  root?.unmount?.()
  container.remove();
  container = null;
  jest.useRealTimers();
});

it("超时后应选择 null", () => {
  const onSelect = jest.fn();
  act(() => {
    root = createRoot(container);
    root.render(<Card onSelect={onSelect} />);
  });

  // 提前 100 毫秒执行
  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // 然后提前 5 秒执行
  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).toHaveBeenCalledWith(null);
});

it("移除时应进行清理", () => {
  const onSelect = jest.fn();
  act(() => {
    root = createRoot(container);
    root.render(<Card onSelect={onSelect} />);
  });
  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // 卸载应用程序
  act(() => {
    root.render(null);
  });
  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).not.toHaveBeenCalled();
});

it("应接受选择", () => {
  const onSelect = jest.fn();
  act(() => {
    root = createRoot(container);
    root.render(<Card onSelect={onSelect} />);
  });

  act(() => {
    container
      .querySelector("[data-testid='2']")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onSelect).toHaveBeenCalledWith(2);
});