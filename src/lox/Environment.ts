import { RuntimeError } from "./error";
import { Token } from "./Token";
import { Value } from "./types";

export class Envirnonment {
  values = new Map<string, Value>();
  enclosing: Envirnonment | null = null;

  constructor(enclosing: Envirnonment | null = null) {
    this.enclosing = enclosing;
  }

  define(name: string, value: Value) {
    this.values.set(name, value);
  }

  assign(name: Token, value: Value): void {
    if (this.values.has(name.lexeme)) {
      this.values.set(name.lexeme, value);
      return;
    }

    if (this.enclosing !== null) {
      return this.enclosing.assign(name);
    }

    throw new RuntimeError(name, "Undefined vairable '" + name.lexeme + "'.");
  }

  get(name: Token): Value {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme);
    }

    if (this.enclosing !== null) {
      return this.enclosing.get(name);
    }

    throw new RuntimeError(name, "Undefined vairable '" + name.lexeme + "'.");
  }
}
