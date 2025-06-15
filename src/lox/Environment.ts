import { RuntimeError } from "./error";
import { Token } from "./Token";
import { Value } from "./types";

export class Envirnonment {
  values = new Map<string, Value>();

  define(name: string, value: Value) {
    this.values.set(name, value);
  }

  get(name: Token) {
    if (this.values.has(name.lexeme)) {
      return this.values.get(name.lexeme);
    }

    throw new RuntimeError(name, "Undefined vairable '" + name.lexeme + "'.");
  }
}
