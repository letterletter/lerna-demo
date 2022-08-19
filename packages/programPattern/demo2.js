"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result)
    __defProp(target, key, result);
  return result;
};
function outer() {
  console.log("Outer: expression");
  return function(target, propertyKey, descriptor) {
    console.log("Outer: result");
  };
}
function inner() {
  console.log("Inner: expression");
  return function(target, propertyKey, descriptor) {
    console.log("Inner: result");
  };
}
class DecoratorComposition {
  run() {
  }
}
__decorateClass([
  outer(),
  inner()
], DecoratorComposition.prototype, "run", 1);
const decoratorComposition = new DecoratorComposition();
decoratorComposition.run();
