import {
  Binary,
  Grouping,
  Literal,
  Unary,
  Expr,
  Stmt,
  Print,
  Expression,
  Var,
  Variable,
  Assign,
  Block,
  If,
  Logical,
  While,
  Call,
  Function,
  Return,
  Class,
  Get,
  Set,
  This,
  Super
} from "./lox/Expr";
import { Lox } from "./lox/Lox";
// import { Reporter } from "./lox/Reporter";
import { Token } from "./lox/Token";
import { TokenType } from "./lox/TokenType";

class ParseError extends Error {}

export class Parser {
  tokens: Token[] = [];
  current = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  expression(): Expr {
    return this.assignment();
  }

  assignment(): Expr {
    const expr = this.or();

    if (this.match(TokenType.EQUAL)) {
      const equals = this.previous();
      const value = this.assignment();

      if (expr instanceof Variable) {
        const name = expr.name;
        return new Assign(name, value);
      } else if (expr instanceof Get) {
        const get = expr;
        return new Set(get.object, get.name, value);
      }

      this._error(equals, "Invalid assignment target");
    }

    return expr;
  }

  or(): Expr {
    let expr = this.and();

    while (this.match(TokenType.OR)) {
      const operator = this.previous();
      const right = this.and();
      expr = new Logical(expr, operator, right);
    }

    return expr;
  }

  and(): Expr {
    let expr = this.equality();

    while (this.match(TokenType.AND)) {
      const operator = this.previous();
      const right = this.equality();

      expr = new Logical(expr, operator, right);
    }

    return expr;
  }

  declaration() {
    try {
      if (this.match(TokenType.CLASS)) {
        return this.classDeclaration();
      }
      if (this.match(TokenType.FUN)) {
        return this.function("function");
      }
      if (this.match(TokenType.VAR)) {
        return this.varDeclaration();
      }
      return this.statement();
    } catch (error) {
      this.synchronize();
      return;
    }
  }

  classDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, "Expect class name.");

    let supperClass: Variable | undefined = undefined;

    if (this.match(TokenType.LESS)) {
      this.consume(TokenType.IDENTIFIER, "Expect superclass name.");
      supperClass = new Variable(this.previous());
    }

    this.consume(TokenType.LEFT_BRACE, "Expect '{' before class body.");

    const methods: Function[] = [];

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      methods.push(this.function("method"));
    }

    this.consume(TokenType.RIGHT_BRACE, "Expect '}' after class body.");

    return new Class(name, methods, supperClass);
  }

  function(kind: "function" | "method") {
    const name = this.consume(
      TokenType.IDENTIFIER,
      "Expect " + kind + " name."
    );

    this.consume(TokenType.LEFT_PAREN, "Expect '(' after " + kind + " name.");

    const parameters: Token[] = [];

    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (parameters.length >= 255) {
          this._error(this.peek(), "Can't have more thant 255 parameters");
        }
        parameters.push(
          this.consume(TokenType.IDENTIFIER, "Expect parameter name.")
        );
      } while (this.match(TokenType.COMMA));
    }

    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after " + kind + " name.");
    this.consume(TokenType.LEFT_BRACE, "Expect '{' before " + kind + " block.");

    const body = this.block();

    return new Function(name, parameters, body);
  }

  equality(): Expr {
    let expr = this.comparision();

    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator = this.previous();
      const right = this.comparision();
      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  previous() {
    return this.tokens[this.current - 1];
  }

  peek() {
    return this.tokens[this.current];
  }

  match(...types: TokenType[]) {
    if (types.some((type) => this.check(type))) {
      this.advance();
      return true;
    }

    return false;
  }

  check(type: TokenType) {
    if (this.isAtEnd()) {
      return false;
    }

    return this.peek().type === type;
  }

  isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  advance() {
    if (!this.isAtEnd()) {
      this.current++;
    }

    return this.previous();
  }

  comparision(): Expr {
    let expr = this.term();

    while (
      this.match(
        TokenType.GREATER,
        TokenType.GREATER_EQUAL,
        TokenType.LESS,
        TokenType.LESS_EQUAL
      )
    ) {
      const operator = this.previous();
      const right = this.term();

      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  term(): Expr {
    let expr = this.factor();

    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator = this.previous();
      const right = this.factor();

      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  factor(): Expr {
    let expr = this.unary();

    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator = this.previous();
      const right = this.unary();

      expr = new Binary(expr, operator, right);
    }

    return expr;
  }

  unary(): Expr {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      const operator = this.previous();
      const right = this.unary();

      return new Unary(operator, right);
    }

    return this.call();
  }

  call() {
    let expr = this.primary();

    while (true) {
      if (this.match(TokenType.LEFT_PAREN)) {
        expr = this.finishCall(expr);
      } else if (this.match(TokenType.DOT)) {
        const name = this.consume(
          TokenType.IDENTIFIER,
          "Expect property name after '.'."
        );
        expr = new Get(expr, name);
      } else {
        break;
      }
    }

    return expr;
  }

  finishCall(callee: Expr) {
    const args: Expr[] = [];

    if (!this.check(TokenType.RIGHT_PAREN)) {
      do {
        if (args.length > 255) {
          this._error(this.peek(), "Can't have more than 255 arguments.");
        }
        args.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }

    const paren = this.consume(
      TokenType.RIGHT_PAREN,
      "Exprct ')' after arguments."
    );

    return new Call(callee, paren, args);
  }

  primary(): Expr {
    if (this.match(TokenType.FALSE)) {
      return new Literal(false);
    }

    if (this.match(TokenType.TRUE)) {
      return new Literal(true);
    }

    if (this.match(TokenType.NIL)) {
      return new Literal(null);
    }

    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new Literal(this.previous().literal);
    }

    if (this.match(TokenType.SUPER)) {
      const keyword = this.previous();
      this.consume(
        TokenType.DOT,
        "Expect '.' after super."
      );
      const method = this.consume(
        TokenType.IDENTIFIER,
        "Expect superclass method name."
      );

      return new Super(keyword, method);
    }

    if (this.match(TokenType.THIS)) {
      return new This(this.previous());
    }

    if (this.match(TokenType.IDENTIFIER)) {
      return new Variable(this.previous());
    }

    if (this.match(TokenType.LEFT_PAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression");
      return new Grouping(expr);
    }

    throw new ParseError("Unrecognized TokenType " + this.peek());
  }

  statement(): Stmt {
    if (this.match(TokenType.IF)) {
      return this.ifStatement();
    }

    if (this.match(TokenType.FOR)) {
      return this.forStatement();
    }

    if (this.match(TokenType.PRINT)) {
      return this.printStatement();
    }

    if (this.match(TokenType.RETURN)) {
      return this.returnStatement();
    }

    if (this.match(TokenType.WHILE)) {
      return this.whileStatement();
    }

    if (this.match(TokenType.LEFT_BRACE)) {
      return new Block(this.block());
    }

    return this.expressionStatement();
  }

  returnStatement() {
    const keyword = this.previous();
    let value = undefined;

    if (!this.check(TokenType.SEMICOLON)) {
      value = this.expression();
    }

    this.consume(TokenType.SEMICOLON, "Expect ';' after return value.");
    return new Return(keyword, value);
  }

  forStatement() {
    this.consume(TokenType.LEFT_PAREN, "Expect, '(' after 'for'.");

    let initializer: Stmt | undefined;

    if (this.match(TokenType.SEMICOLON)) {
      initializer = undefined;
    } else if (this.match(TokenType.VAR)) {
      initializer = this.varDeclaration();
    } else {
      initializer = this.expressionStatement();
    }

    let condition: Expr | undefined;

    if (!this.check(TokenType.SEMICOLON)) {
      condition = this.expression();
    }

    this.consume(TokenType.SEMICOLON, "Expect ';' after loop condition.");

    let increment: Expr | undefined;

    if (!this.check(TokenType.RIGHT_PAREN)) {
      increment = this.expression();
    }

    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after for clauses.");

    let body = this.statement();

    if (increment !== undefined) {
      body = new Block([body, new Expression(increment)]);
    }

    if (condition === undefined) {
      condition = new Literal(true);
    }

    body = new While(condition, body);

    if (initializer !== undefined) {
      body = new Block([initializer, body]);
    }

    return body;
  }

  whileStatement() {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'while'.");

    const condition = this.expression();

    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after condition.");

    const body = this.statement();

    return new While(condition, body);
  }

  ifStatement() {
    this.consume(TokenType.LEFT_PAREN, "Expect '(' after 'if'.");

    const condition: Expr = this.expression();

    this.consume(TokenType.RIGHT_PAREN, "Expect ')' after 'if'.");

    const thenBranch = this.statement();
    let elseBranch: Stmt | undefined = undefined;

    if (this.match(TokenType.ELSE)) {
      elseBranch = this.statement();
    }

    return new If(condition, thenBranch, elseBranch);
  }

  block(): Stmt[] {
    const statements: Stmt[] = [];

    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      const declaration = this.declaration();
      declaration && statements.push(declaration);
    }

    this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block");

    return statements;
  }

  printStatement() {
    const expr = this.expression();

    this.consume(TokenType.SEMICOLON, 'Expect ";" after value');

    return new Print(expr);
  }

  varDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, "Expect variable name");

    let initializer: Expr | undefined;

    if (this.match(TokenType.EQUAL)) {
      initializer = this.expression();
    }

    this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration");

    return new Var(name, initializer);
  }

  expressionStatement() {
    const expr = this.expression();

    this.consume(TokenType.SEMICOLON, 'Expect ";" after value');

    return new Expression(expr);
  }

  consume(type: TokenType, message: string) {
    if (this.check(type)) {
      return this.advance();
    }

    throw this._error(this.peek(), message);
  }

  _error(token: Token, message: string) {
    Lox.error(token, message);

    return new ParseError(message + " " + this.peek());
  }

  synchronize() {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.peek().type === TokenType.SEMICOLON) {
        return;
      }

      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FOR:
        case TokenType.FUN:
        case TokenType.IF:
        case TokenType.PRINT:
        case TokenType.RETURN:
        case TokenType.VAR:
        case TokenType.WHILE: {
          return;
        }
      }

      this.advance();
    }
  }

  parse() {
    const statements: Stmt[] = [];

    while (!this.isAtEnd()) {
      const declaration = this.declaration();

      declaration && statements.push(declaration);
    }

    return statements;
  }
}
