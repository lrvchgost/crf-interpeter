import { LoxCallable, Value } from "./types";
import { Function } from "./Expr";
import { Interpreter } from "./interpreter";
import { Envirnonment } from "./Environment";
import { ReturnTrhow } from "./ReturnTrhow";
import { LoxInstance } from "./LoxClass";

export class LoxFunction extends LoxCallable {
  private declaration: Function;
  private closure: Envirnonment;
  private isInitializer: boolean = false;

  constructor(
    declaration: Function,
    closure: Envirnonment,
    isInitializer: boolean
  ) {
    super();
    this.declaration = declaration;
    this.closure = closure;
    this.isInitializer = isInitializer;
  }

  call(interpreter: Interpreter, ...argArray: Value[]) {
    const environment = new Envirnonment(this.closure);

    for (let i = 0; i < this.declaration.params.length; i++) {
      environment.define(this.declaration.params[i].lexeme, argArray[i]);
    }

    try {
      interpreter.executeBlock(this.declaration.body, environment);
    } catch (returnValue) {
      if (this.isInitializer) {
        return this.closure.getAt(0, "this");
      }
      const value: ReturnTrhow = returnValue as ReturnTrhow;
      return value.value;
    }

    if (this.isInitializer) {
      return this.closure.getAt(0, "this");
    }

    return null;
  }

  arity() {
    return this.declaration.params.length;
  }

  toString() {
    return "<fn " + this.declaration.name.lexeme + ">";
  }

  bind(instance: LoxInstance) {
    const environment = new Envirnonment(this.closure);

    environment.define("this", instance);

    return new LoxFunction(this.declaration, environment, this.isInitializer);
  }
}
