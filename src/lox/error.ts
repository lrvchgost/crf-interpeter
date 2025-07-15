import {Token} from "./Token";

export class RuntimeError extends Error {
  token: Token;

  constructor(token: Token, message: string) {
    super("[RuntimeError]: " + message);

    this.token = token;
  }
}
