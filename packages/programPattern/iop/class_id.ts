import { Container, injectable, inject } from "inversify";
import "reflect-metadata"

interface Warrior {
  fight(): string;
  sneak(): string;
}

@injectable()
class Katana {
    public hit() {
        return "cut!";
    }
}

@injectable()
class Shuriken {
    public throw() {
        return "hit!";
    }
}

@injectable()
class Ninja implements Warrior {

    private _katana: Katana;
    private _shuriken: Shuriken;

    public constructor(
        @inject(Katana) katana: Katana, 
        @inject(Shuriken) shuriken: Shuriken
    ) {
        this._katana = katana;
        this._shuriken = shuriken;
    }

    public fight() { return this._katana.hit(); };
    public sneak() { return this._shuriken.throw(); };

}

var container = new Container();
container.bind<Ninja>(Ninja).to(Ninja);
container.bind<Katana>(Katana).to(Katana);
container.bind<Shuriken>(Shuriken).to(Shuriken);

let ninja = container.get<Ninja>(Ninja)
console.log(ninja.fight())