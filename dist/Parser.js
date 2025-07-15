"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const Expr_1 = require("./lox/Expr");
const Lox_1 = require("./lox/Lox");
const TokenType_1 = require("./lox/TokenType");
class ParseError extends Error {
}
class Parser {
    tokens = [];
    current = 0;
    constructor(tokens) {
        this.tokens = tokens;
    }
    expression() {
        return this.assignment();
    }
    assignment() {
        const expr = this.or();
        if (this.match(TokenType_1.TokenType.EQUAL)) {
            const equals = this.previous();
            const value = this.assignment();
            if (expr instanceof Expr_1.Variable) {
                const name = expr.name;
                return new Expr_1.Assign(name, value);
            }
            else if (expr instanceof Expr_1.Get) {
                const get = expr;
                return new Expr_1.Set(get.object, get.name, value);
            }
            this._error(equals, "Invalid assignment target");
        }
        return expr;
    }
    or() {
        let expr = this.and();
        while (this.match(TokenType_1.TokenType.OR)) {
            const operator = this.previous();
            const right = this.and();
            expr = new Expr_1.Logical(expr, operator, right);
        }
        return expr;
    }
    and() {
        let expr = this.equality();
        while (this.match(TokenType_1.TokenType.AND)) {
            const operator = this.previous();
            const right = this.equality();
            expr = new Expr_1.Logical(expr, operator, right);
        }
        return expr;
    }
    declaration() {
        try {
            if (this.match(TokenType_1.TokenType.CLASS)) {
                return this.classDeclaration();
            }
            if (this.match(TokenType_1.TokenType.FUN)) {
                return this.function("function");
            }
            if (this.match(TokenType_1.TokenType.VAR)) {
                return this.varDeclaration();
            }
            return this.statement();
        }
        catch (error) {
            this.synchronize();
            return;
        }
    }
    classDeclaration() {
        const name = this.consume(TokenType_1.TokenType.IDENTIFIER, "Expect class name.");
        this.consume(TokenType_1.TokenType.LEFT_BRACE, "Expect '{' before class body.");
        const methods = [];
        while (!this.check(TokenType_1.TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            methods.push(this.function("method"));
        }
        this.consume(TokenType_1.TokenType.RIGHT_BRACE, "Expect '}' after class body.");
        return new Expr_1.Class(name, methods);
    }
    function(kind) {
        const name = this.consume(TokenType_1.TokenType.IDENTIFIER, "Expect " + kind + " name.");
        this.consume(TokenType_1.TokenType.LEFT_PAREN, "Expect '(' after " + kind + " name.");
        const parameters = [];
        if (!this.check(TokenType_1.TokenType.RIGHT_PAREN)) {
            do {
                if (parameters.length >= 255) {
                    this._error(this.peek(), "Can't have more thant 255 parameters");
                }
                parameters.push(this.consume(TokenType_1.TokenType.IDENTIFIER, "Expect parameter name."));
            } while (this.match(TokenType_1.TokenType.COMMA));
        }
        this.consume(TokenType_1.TokenType.RIGHT_PAREN, "Expect ')' after " + kind + " name.");
        this.consume(TokenType_1.TokenType.LEFT_BRACE, "Expect '{' before " + kind + " block.");
        const body = this.block();
        return new Expr_1.Function(name, parameters, body);
    }
    equality() {
        let expr = this.comparision();
        while (this.match(TokenType_1.TokenType.BANG_EQUAL, TokenType_1.TokenType.EQUAL_EQUAL)) {
            const operator = this.previous();
            const right = this.comparision();
            expr = new Expr_1.Binary(expr, operator, right);
        }
        return expr;
    }
    previous() {
        return this.tokens[this.current - 1];
    }
    peek() {
        return this.tokens[this.current];
    }
    match(...types) {
        if (types.some((type) => this.check(type))) {
            this.advance();
            return true;
        }
        return false;
    }
    check(type) {
        if (this.isAtEnd()) {
            return false;
        }
        return this.peek().type === type;
    }
    isAtEnd() {
        return this.peek().type === TokenType_1.TokenType.EOF;
    }
    advance() {
        if (!this.isAtEnd()) {
            this.current++;
        }
        return this.previous();
    }
    comparision() {
        let expr = this.term();
        while (this.match(TokenType_1.TokenType.GREATER, TokenType_1.TokenType.GREATER_EQUAL, TokenType_1.TokenType.LESS, TokenType_1.TokenType.LESS_EQUAL)) {
            const operator = this.previous();
            const right = this.term();
            expr = new Expr_1.Binary(expr, operator, right);
        }
        return expr;
    }
    term() {
        let expr = this.factor();
        while (this.match(TokenType_1.TokenType.MINUS, TokenType_1.TokenType.PLUS)) {
            const operator = this.previous();
            const right = this.factor();
            expr = new Expr_1.Binary(expr, operator, right);
        }
        return expr;
    }
    factor() {
        let expr = this.unary();
        while (this.match(TokenType_1.TokenType.SLASH, TokenType_1.TokenType.STAR)) {
            const operator = this.previous();
            const right = this.unary();
            expr = new Expr_1.Binary(expr, operator, right);
        }
        return expr;
    }
    unary() {
        if (this.match(TokenType_1.TokenType.BANG, TokenType_1.TokenType.MINUS)) {
            const operator = this.previous();
            const right = this.unary();
            return new Expr_1.Unary(operator, right);
        }
        return this.call();
    }
    call() {
        let expr = this.primary();
        while (true) {
            if (this.match(TokenType_1.TokenType.LEFT_PAREN)) {
                expr = this.finishCall(expr);
            }
            else if (this.match(TokenType_1.TokenType.DOT)) {
                const name = this.consume(TokenType_1.TokenType.IDENTIFIER, "Expect property name after '.'.");
                expr = new Expr_1.Get(expr, name);
            }
            else {
                break;
            }
        }
        return expr;
    }
    finishCall(callee) {
        const args = [];
        if (!this.check(TokenType_1.TokenType.RIGHT_PAREN)) {
            do {
                if (args.length > 255) {
                    this._error(this.peek(), "Can't have more than 255 arguments.");
                }
                args.push(this.expression());
            } while (this.match(TokenType_1.TokenType.COMMA));
        }
        const paren = this.consume(TokenType_1.TokenType.RIGHT_PAREN, "Exprct ')' after arguments.");
        return new Expr_1.Call(callee, paren, args);
    }
    primary() {
        if (this.match(TokenType_1.TokenType.FALSE)) {
            return new Expr_1.Literal(false);
        }
        if (this.match(TokenType_1.TokenType.TRUE)) {
            return new Expr_1.Literal(true);
        }
        if (this.match(TokenType_1.TokenType.NIL)) {
            return new Expr_1.Literal(null);
        }
        if (this.match(TokenType_1.TokenType.NUMBER, TokenType_1.TokenType.STRING)) {
            return new Expr_1.Literal(this.previous().literal);
        }
        if (this.match(TokenType_1.TokenType.IDENTIFIER)) {
            return new Expr_1.Variable(this.previous());
        }
        if (this.match(TokenType_1.TokenType.LEFT_PAREN)) {
            const expr = this.expression();
            this.consume(TokenType_1.TokenType.RIGHT_PAREN, "Expect ')' after expression");
            return new Expr_1.Grouping(expr);
        }
        throw new ParseError("Unrecognized TokenType " + this.peek());
    }
    statement() {
        if (this.match(TokenType_1.TokenType.IF)) {
            return this.ifStatement();
        }
        if (this.match(TokenType_1.TokenType.FOR)) {
            return this.forStatement();
        }
        if (this.match(TokenType_1.TokenType.PRINT)) {
            return this.printStatement();
        }
        if (this.match(TokenType_1.TokenType.RETURN)) {
            return this.returnStatement();
        }
        if (this.match(TokenType_1.TokenType.WHILE)) {
            return this.whileStatement();
        }
        if (this.match(TokenType_1.TokenType.LEFT_BRACE)) {
            return new Expr_1.Block(this.block());
        }
        return this.expressionStatement();
    }
    returnStatement() {
        const keyword = this.previous();
        let value = undefined;
        if (!this.check(TokenType_1.TokenType.SEMICOLON)) {
            value = this.expression();
        }
        this.consume(TokenType_1.TokenType.SEMICOLON, "Expect ';' after return value.");
        return new Expr_1.Return(keyword, value);
    }
    forStatement() {
        this.consume(TokenType_1.TokenType.LEFT_PAREN, "Expect, '(' after 'for'.");
        let initializer;
        if (this.match(TokenType_1.TokenType.SEMICOLON)) {
            initializer = undefined;
        }
        else if (this.match(TokenType_1.TokenType.VAR)) {
            initializer = this.varDeclaration();
        }
        else {
            initializer = this.expressionStatement();
        }
        let condition;
        if (!this.check(TokenType_1.TokenType.SEMICOLON)) {
            condition = this.expression();
        }
        this.consume(TokenType_1.TokenType.SEMICOLON, "Expect ';' after loop condition.");
        let increment;
        if (!this.check(TokenType_1.TokenType.RIGHT_PAREN)) {
            increment = this.expression();
        }
        this.consume(TokenType_1.TokenType.RIGHT_PAREN, "Expect ')' after for clauses.");
        let body = this.statement();
        if (increment !== undefined) {
            body = new Expr_1.Block([body, new Expr_1.Expression(increment)]);
        }
        if (condition === undefined) {
            condition = new Expr_1.Literal(true);
        }
        body = new Expr_1.While(condition, body);
        if (initializer !== undefined) {
            body = new Expr_1.Block([initializer, body]);
        }
        return body;
    }
    whileStatement() {
        this.consume(TokenType_1.TokenType.LEFT_PAREN, "Expect '(' after 'while'.");
        const condition = this.expression();
        this.consume(TokenType_1.TokenType.RIGHT_PAREN, "Expect ')' after condition.");
        const body = this.statement();
        return new Expr_1.While(condition, body);
    }
    ifStatement() {
        this.consume(TokenType_1.TokenType.LEFT_PAREN, "Expect '(' after 'if'.");
        const condition = this.expression();
        this.consume(TokenType_1.TokenType.RIGHT_PAREN, "Expect ')' after 'if'.");
        const thenBranch = this.statement();
        let elseBranch = undefined;
        if (this.match(TokenType_1.TokenType.ELSE)) {
            elseBranch = this.statement();
        }
        return new Expr_1.If(condition, thenBranch, elseBranch);
    }
    block() {
        const statements = [];
        while (!this.check(TokenType_1.TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
            const declaration = this.declaration();
            declaration && statements.push(declaration);
        }
        this.consume(TokenType_1.TokenType.RIGHT_BRACE, "Expect '}' after block");
        return statements;
    }
    printStatement() {
        const expr = this.expression();
        this.consume(TokenType_1.TokenType.SEMICOLON, 'Expect ";" after value');
        return new Expr_1.Print(expr);
    }
    varDeclaration() {
        const name = this.consume(TokenType_1.TokenType.IDENTIFIER, "Expect variable name");
        let initializer;
        if (this.match(TokenType_1.TokenType.EQUAL)) {
            initializer = this.expression();
        }
        this.consume(TokenType_1.TokenType.SEMICOLON, "Expect ';' after variable declaration");
        return new Expr_1.Var(name, initializer);
    }
    expressionStatement() {
        const expr = this.expression();
        this.consume(TokenType_1.TokenType.SEMICOLON, 'Expect ";" after value');
        return new Expr_1.Expression(expr);
    }
    consume(type, message) {
        if (this.check(type)) {
            return this.advance();
        }
        throw this._error(this.peek(), message);
    }
    _error(token, message) {
        Lox_1.Lox.error(token, message);
        return new ParseError(message + " " + this.peek());
    }
    synchronize() {
        this.advance();
        while (!this.isAtEnd()) {
            if (this.peek().type === TokenType_1.TokenType.SEMICOLON) {
                return;
            }
            switch (this.peek().type) {
                case TokenType_1.TokenType.CLASS:
                case TokenType_1.TokenType.FOR:
                case TokenType_1.TokenType.FUN:
                case TokenType_1.TokenType.IF:
                case TokenType_1.TokenType.PRINT:
                case TokenType_1.TokenType.RETURN:
                case TokenType_1.TokenType.VAR:
                case TokenType_1.TokenType.WHILE: {
                    return;
                }
            }
            this.advance();
        }
    }
    parse() {
        const statements = [];
        while (!this.isAtEnd()) {
            const declaration = this.declaration();
            declaration && statements.push(declaration);
        }
        return statements;
    }
}
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map