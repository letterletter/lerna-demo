'use strict';
/**
 * @jest-environment jsdom
 */
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

import React from "react";
import { createRoot } from 'react-dom/client'
import { act } from "react-dom/test-utils";

import Card from '../src/Card';

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
    root?.unmount?.()
});

describe('Card', () => {
    it('needs tests', () => {
        console.log('test Cadr')
    });

    it('点击更新点击次数', () => {
        const onClick = jest.fn()
        act(() => {
            root = createRoot(container)
            root.render(<Card onClick={onClick} />);
        })

        const button = document.getElementById('clickBtn');
        var clickCount = document.getElementById('clickTimes');

        act(() => {
            button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        // expect(clickCount.innerText).toBe(1);
        // console.log('inner', clickCount.innerHTML)
        expect(onClick).toHaveBeenCalledTimes(1);

        act(() => {
            for (let i = 0; i < 5; i++) {
                button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
            }
        });

        expect(onClick).toHaveBeenCalledTimes(6);


    });

});
