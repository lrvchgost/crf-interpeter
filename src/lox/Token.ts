import { TokenType } from "./TokenType";

type Literal = string | number | null | undefined;

export class Token {
  type: TokenType;
  lexeme: string;
  line: number;
  literal: Literal;
  start: number;
  length: number;

  constructor(type: TokenType, lexeme: string, literal: Literal, line: number, start: number, length: number) {
    this.type = type;
    this.lexeme = lexeme;
    this.literal = literal;
    this.line = line;
    this.start = start;
    this.length = length;
  }

  toString() {
    return `${this.type} ${this.lexeme} ${this.literal}`;
  }
}
