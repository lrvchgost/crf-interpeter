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
        return this.equality();
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
        return this.primary();
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
        if (this.match(TokenType_1.TokenType.LEFT_PAREN)) {
            const expr = this.expression();
            this.consume(TokenType_1.TokenType.RIGHT_PAREN, "Expect ')' after expression");
            return new Expr_1.Grouping(expr);
        }
        throw new ParseError("Unrecognized TokenType " + this.peek());
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
        try {
            return this.expression();
        }
        catch (error) {
            console.error(error);
            return null;
        }
    }
}
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map