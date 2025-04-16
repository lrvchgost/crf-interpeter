import { Reporter } from "./lox/Reporter";
import { Literal, Token } from "./lox/Token";
import { TokenType } from "./lox/TokenType";

export class Scanner extends Reporter {
  source: string;
  tokens: Token[] = [];
  // first character of lexeme
  start: number = 0;
  // the current character being considered
  current: number = 0;
  line: number = 1;

  constructor(source: string) {
    super();

    this.source = source;

    // console.log(source);
    // console.log(source.length);
  }

  scanTokens() {
    while (!this.isAtEnd()) {
      this.start = this.current;

      // console.log('start', this.start)
      // console.log('='.repeat(20));

      this.scanToken();
    }

    this.tokens.push(
      new Token(TokenType.EOF, "", null, this.line, this.start, 0)
    );

    return this.tokens;
  }

  scanToken() {
    const char: string = this.advance();

    switch (char) {
      case "(":
        this.addToken(TokenType.LEFT_PAREN);
        break;
      case ")":
        this.addToken(TokenType.RIGHT_PAREN);
        break;
      case "{":
        this.addToken(TokenType.LEFT_BRACE);
        break;
      case "}":
        this.addToken(TokenType.RIGHT_BRACE);
        break;
      case ",":
        this.addToken(TokenType.COMMA);
        break;
      case ".":
        this.addToken(TokenType.DOT);
        break;
      case "-":
        this.addToken(TokenType.MINUS);
        break;
      case "+":
        this.addToken(TokenType.PLUS);
        break;
      case ";":
        this.addToken(TokenType.SEMICOLON);
        break;
      case "*":
        this.addToken(TokenType.STAR);
        break;
      default:
        this.error(this.line, "Unexpected character. " + char);
    }
  }

  addToken(type: TokenType): void;
  addToken(type: TokenType, literal: Literal): void;
  addToken(type: TokenType, literal?: Literal) {
    const text = this.source.slice(this.start, this.current);

    if (literal === undefined) {
      return this.addToken(type, null);
    }

    this.tokens.push(
      new Token(
        type,
        text,
        literal,
        this.line,
        this.start,
        this.current - this.start
      )
    );
  }

  advance() {
    return this.source.charAt(this.current++);
  }

  isAtEnd() {
    return this.current >= this.source.length;
  }
}
