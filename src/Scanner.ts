import {Lox} from "./lox/Lox";
// import { Reporter } from "./lox/Reporter";
import { Literal, Token } from "./lox/Token";
import { TokenType } from "./lox/TokenType";

export class Scanner {
  source: string;
  tokens: Token[] = [];
  // first character of lexeme
  start: number = 0;
  // the current character being considered
  current: number = 0;
  line: number = 1;

  private static keywords = new Map<string, TokenType>([
    ["and", TokenType.AND],
    ["class", TokenType.CLASS],
    ["else", TokenType.ELSE],
    ["for", TokenType.FOR],
    ["fun", TokenType.FUN],
    ["if", TokenType.IF],
    ["nil", TokenType.NIL],
    ["or", TokenType.OR],
    ["print", TokenType.PRINT],
    ["return", TokenType.RETURN],
    ["super", TokenType.SUPER],
    ["this", TokenType.THIS],
    ["true", TokenType.TRUE],
    ["var", TokenType.VAR],
    ["while", TokenType.WHILE],
  ]);

  constructor(source: string) {
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
      case '"':
        this.string();
        break;

      case " ":
      case "\r":
      case "\t":
        break;
      case "\n":
        this.line++;
        break;
      default:
        if (this.isDigit(char)) {
          this.number();
        } else if (this.isAlpha(char)) {
          this.identifier();
        } else {
          Lox.error(this.line, "[Scanner]: Unexpected character. " + char);
        }
        break;
    }
  }

  peek() {
    if (this.isAtEnd()) {
      return "\0";
    }

    return this.getCurrentChar();
  }

  peekNext() {
    if (this.current + 1 >= this.source.length) {
      return "\0";
    }

    return this.source.charAt(this.current + 1);
  }

  getTextPiece(start: number, end: number) {
    return this.source.slice(start, end);
  }

  addToken(type: TokenType): void;
  addToken(type: TokenType, literal: Literal): void;
  addToken(type: TokenType, literal?: Literal) {
    const text = this.getTextPiece(this.start, this.current);

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

  string() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === "\n") {
        this.line++;
      }
      this.advance();
    }

    if (this.isAtEnd()) {
      return Lox.error(this.line, "Unterminated string");
    }

    this.advance();

    const value = this.getTextPiece(this.start + 1, this.current - 1);

    this.addToken(TokenType.STRING, value);
  }

  number() {
    while (this.isDigit(this.peek()) && !this.isAtEnd()) {
      this.advance();
    }

    if (this.peek() === "." && this.isDigit(this.peekNext())) {
      this.advance();

      while (this.isDigit(this.peek()) && !this.isAtEnd()) {
        this.advance();
      }
    }

    this.addToken(
      TokenType.NUMBER,
      Number(this.getTextPiece(this.start, this.current))
    );
  }

  identifier() {
    while (this.isAlphaNumeric(this.peek())) {
      this.advance();
    }

    const text = this.getTextPiece(this.start, this.current);
    let type = Scanner.keywords.get(text);

    if (type === undefined) {
      type = TokenType.IDENTIFIER;

    }

    this.addToken(type);
  }

  isDigit(char: string) {
    return char >= "0" && char <= "9";
  }

  isAlpha(char: string) {
    return (
      (char >= "a" && char <= "z") ||
      (char >= "A" && char <= "Z") ||
      char === "_"
    );
  }

  isAlphaNumeric(char: string) {
    return this.isAlpha(char) || this.isDigit(char);
  }
}
