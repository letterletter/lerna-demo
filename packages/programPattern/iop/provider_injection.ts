import { Container, injectable, inject, optional } from "inversify";
import "reflect-metadata"

@injectable()
class Katana {
    public name: string;
    public constructor() {
        this.name = "Katana";
    }
    public hit() {
      return "cut!";
  }
}

@injectable()
class Shuriken {
    public name: string;
    public constructor() {
        this.name = "Shuriken";
    }
    public throw() {
      return "throw!";
  }
}

type KatanaProvider = () => Promise<Katana>;
@injectable()
class Ninja implements Ninja {

    public katana: Katana;
    public shuriken: Shuriken;
    public katanaProvider: KatanaProvider;

    public constructor(
	    @inject("KatanaProvider") katanaProvider: KatanaProvider, 
	    @inject("Shuriken") shuriken: Shuriken
    ) {
        this.katanaProvider = katanaProvider;
        this.katana = null;
        this.shuriken = shuriken;
    }

    public fight() { return this.katana.hit(); };
    public sneak() { return this.shuriken.throw(); };

}
let container = new Container();
container.bind<Shuriken>("Shuriken").to(Shuriken);
container.bind<Ninja>("Ninja").to(Ninja);
container.bind<Katana>("Katana").to(Katana);

container.bind<KatanaProvider>("KatanaProvider").toProvider<Katana>((context) => {
  return () => {
      return new Promise<Katana>((resolve) => {
          let katana = context.container.get<Katana>("Katana");
          resolve(katana);
      });
  };
});

var ninja = container.get<Ninja>("Ninja");

ninja.katanaProvider()
   .then((katana) => { ninja.katana = katana; console.log('ninja', ninja)})
   .catch((e) => { console.log(e); });