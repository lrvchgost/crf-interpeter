import { Token } from "./lox/Token";
import { TokenType } from "./lox/TokenType";

export class Scanner {
  source: string;
  tokens: Token[] = [];
  // first character of lexeme
  start: number = 0;
  // the current character being considered
  current: number = 0;
  line: number = 1;

  constructor(source: string) {
    this.source = source;

    console.log(source);
  }

  scanTokens() {
    while (!this.isAtEnd()) {
      this.start = this.current;

      this.scanTokens();
    }

    this.tokens.push(new Token(TokenType.EOF, "", null, this.line, this.start, 0));
    return this.tokens;
  }

  isAtEnd() { return true }
}
