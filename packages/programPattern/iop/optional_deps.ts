import { Container, injectable, inject, optional } from "inversify";
import "reflect-metadata"

@injectable()
class Katana {
    public name: string;
    public constructor() {
        this.name = "Katana";
    }
}

@injectable()
class Shuriken {
    public name: string;
    public constructor() {
        this.name = "Shuriken";
    }
}

@injectable()
class Ninja {
    public name: string;
    public katana: Katana;
    public shuriken: Shuriken;
    public constructor(
        @inject("Katana") katana: Katana,
        @inject("Shuriken") @optional() shuriken: Shuriken // Optional!
    ) {
        this.name = "Ninja";
        this.katana = katana;
        this.shuriken = shuriken;
    }
}

let container = new Container();

container.bind<Katana>("Katana").to(Katana);
container.bind<Ninja>("Ninja").to(Ninja);

let ninja = container.get<Ninja>("Ninja");
// expect(ninja.name).to.eql("Ninja");
// expect(ninja.katana.name).to.eql("Katana");
// expect(ninja.shuriken).to.eql(undefined);
console.log('ninja', ninja)
container.bind<Shuriken>("Shuriken").to(Shuriken);

ninja = container.get<Ninja>("Ninja");
// expect(ninja.name).to.eql("Ninja");
// expect(ninja.katana.name).to.eql("Katana");
// expect(ninja.shuriken.name).to.eql("Shuriken");

console.log('ninja after', ninja)
