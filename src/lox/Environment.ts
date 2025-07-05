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
      return this.enclosing.assign(name, value);
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

  getAt(distance: number, name: string) {
    return this.ancestor(distance).values.get(name);
  }

  assignAt(distance: number, name: Token, value: Value) {
    return this.ancestor(distance).values.set(name.lexeme, value);
  }

  ancestor(distance: number) {
    let env: Envirnonment = this;

    for (let i = 0; i < distance; i++) {
      env = env.enclosing as Envirnonment;
    }

    return env;
  }
}
