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
function log(target, propertyKey, descriptor) {
  descriptor.value = function() {
    console.log("target", propertyKey);
  };
  return descriptor;
}
class Person {
  say(nick) {
    return `hi ${nick}`;
  }
}
__decorateClass([
  log
], Person.prototype, "say", 1);
var person = new Person();
person.say("\u5C0F\u660E");
function BankCard(constructor) {
  constructor.prototype.cardId = Math.floor(Math.random() * 1e3);
}
let HSBCBankCard = class {
  constructor(name) {
    this.name = name;
  }
};
HSBCBankCard = __decorateClass([
  BankCard
], HSBCBankCard);
const card = new HSBCBankCard("Dennis");
console.log(card.name, card.cardId);
