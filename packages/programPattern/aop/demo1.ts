function log(
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
){
  descriptor.value = function() {
    console.log('target', propertyKey)
  }
  // return function(target: any,
  //   propertyKey: string,
  //   descriptor: PropertyDescriptor) {
  //     console.log('PropertyKey', propertyKey);
  //     descriptor.value = function(...args) {
  //       console.log('target', target)
  //     }
  //     return descriptor;
  //   };
  return descriptor
}
class Person {
  @log
  say(nick) {
    return `hi ${nick}`;
  }
}
var person = new Person();
person.say('小明');

function BankCard(constructor: Function) {
  constructor.prototype.cardId = Math.floor(Math.random() * 1000);
}

@BankCard
class HSBCBankCard {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

// Using class extends
// class BankCard {
//   cardId: number;

//   constructor() {
//     this.cardId = Math.floor(Math.random() * 1000);
//   }
// }

// class HSBCBankCard extends BankCard {
//   name: string;
//   constructor(name: string) {
//     super();
//     this.name = name;
//   }
// }

const card = new HSBCBankCard("Dennis");
console.log(card.name, card.cardId);