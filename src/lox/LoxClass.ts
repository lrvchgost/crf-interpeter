import { RuntimeError } from "./error";
import {Interpreter} from "./interpreter";
import { LoxFunction } from "./LoxFunction";
import { Token } from "./Token";
import { LoxCallable, Value } from "./types";

export class LoxClass extends LoxCallable {
  name: string;
  methods = new Map<string, LoxFunction>();

  constructor(name: string, methods: Map<string, LoxFunction>) {
    super();
    this.name = name;
    this.methods = methods;
  }

  call(interpreter: Interpreter, ...argArray: Value[]) {
    const instance = new LoxInstance(this);

    const initializer = this.findMethod('init');

    if (initializer) {
      initializer.bind(instance).call(interpreter, ...argArray);
    }

    return instance;
  }

  arity() {
    const initializer = this.findMethod('init');

    if (!initializer) {
      return 0;
    }
    return initializer.arity();
  }

  toString() {
    return this.name;
  }

  findMethod(name: string) {
    if (this.methods.has(name)) {
      return this.methods.get(name);
    }

    return null;
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

    const method = this.kclass.findMethod(name.lexeme);

    if (method) {
      return method.bind(this);
    }


    throw new RuntimeError(
      name,
      "Undefined property '" +
        name.lexeme +
        "'. Accessing on an instance of the class '" +
        this.kclass.name +
        "'."
    );
  }

  set(name: Token, value: Value) {
    this.fields.set(name.lexeme, value);
  }
}
