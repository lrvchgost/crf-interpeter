import { Value } from "./types";

export class ReturnTrhow extends Error {
  value: Value;

  constructor(value: Value) {
    super("");

    this.value = value;
  }
}
