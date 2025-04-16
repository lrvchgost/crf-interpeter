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

      this.scanToken();
    }

    this.tokens.push(
      new Token(TokenType.EOF, "", null, this.line, this.start, 0)
    );

    return this.tokens;
  }

  getCurrentChar() {
    return this.source.charAt(this.current);
  }

  match(expected: string) {
    if (this.isAtEnd()) {
      return false;
    }

    if (this.getCurrentChar() !== expected) {
      return false;
    }

    this.current++;

    return true;
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

      case "!":
        this.addToken(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case "=":
        this.addToken(
          this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL
        );
        break;
      case "<":
        this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case ">":
        this.addToken(
          this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER
        );
        break;

      case "/":
        if (this.match("/")) {
          while (this.peek() !== "\n" && !this.isAtEnd()) {
            this.advance();
          }
        } else {
          this.addToken(TokenType.SLASH);
        }
        break;

      case " ":
      case "\r":
      case "\t":
        break;
      case "\n":
        this.line++;
        break;
      default:
        this.error(this.line, "Unexpected character. " + char);
    }
  }

  peek() {
    if (this.isAtEnd()) {
      return "\0";
    }

    return this.getCurrentChar();
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
