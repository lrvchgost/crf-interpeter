import { RuntimeError } from "./error";
import { Interpreter } from "./interpreter";
import { Token } from "./Token";
import { LoxCallable, Value } from "./types";

export class LoxClass extends LoxCallable {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }

  call(interpreter: Interpreter, ...argArray: Value[]) {
    console.log("hey", interpreter);
    console.log("hey", argArray);
    const instance = new LoxInstance(this);
    return instance;
  }

  arity() {
    return 0;
  }

  toString() {
    return this.name;
  }
}

export class LoxInstance {
  private kclass: LoxClass;
  private fields = new Map<string, Value>();

  constructor(kclass: LoxClass) {
    this.kclass = kclass;
  }

  toString() {
    return this.kclass.name + " instance";
  }

  get(name: Token) {
    if (this.fields.has(name.lexeme)) {
      return this.fields.get(name.lexeme);
    }

    throw new RuntimeError(
      name,
      "Undefined property '" +
        name.lexeme +
        "'. Accessing on the instance of class '" +
        this.kclass.name +
        "'."
    );
  }

  set(name: Token, value: Value) {
    this.fields.set(name.lexeme, value);
  }
}
