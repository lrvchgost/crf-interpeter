import { LoxCallable, Value } from "./types";
import { Function } from "./Expr";
import { Interpreter } from "./interpreter";
import { Envirnonment } from "./Environment";
import {ReturnTrhow} from "./ReturnTrhow";

export class LoxFunction extends LoxCallable {
  private declaration: Function;

  constructor(declaration: Function) {
    super();
    this.declaration = declaration;
  }

  call(interpreter: Interpreter, ...argArray: Value[]) {
    const environment = new Envirnonment(interpreter.globals);

    for (let i = 0; i < this.declaration.params.length; i++) {
      environment.define(this.declaration.params[i].lexeme, argArray[i]);
    }

    try {
      interpreter.executeBlock(this.declaration.body, environment);
    } catch (returnValue) {
      const value: ReturnTrhow = returnValue as ReturnTrhow;
      return value.value;
    }

    return null;
  }

  arity() {
    return this.declaration.params.length;
  }

  toString() {
    return "<fn " + this.declaration.name.lexeme + ">";
  }
}
