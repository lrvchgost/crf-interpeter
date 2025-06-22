import { LoxCallable } from "./types";

export class LoxClock extends LoxCallable {
  call() {
    return Date.now() / 1000;
  }

  arity() {
    return 0;
  }

  toString() {
    return "<native fn>";
  }
}
