"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scanner = void 0;
const Reporter_1 = require("./lox/Reporter");
const Token_1 = require("./lox/Token");
const TokenType_1 = require("./lox/TokenType");
class Scanner extends Reporter_1.Reporter {
    source;
    tokens = [];
    start = 0;
    current = 0;
    line = 1;
    constructor(source) {
        super();
        this.source = source;
    }
    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }
        this.tokens.push(new Token_1.Token(TokenType_1.TokenType.EOF, "", null, this.line, this.start, 0));
        return this.tokens;
    }
    scanToken() {
        const char = this.advance();
        switch (char) {
            case "(":
                this.addToken(TokenType_1.TokenType.LEFT_PAREN);
                break;
            case ")":
                this.addToken(TokenType_1.TokenType.RIGHT_PAREN);
                break;
            case "{":
                this.addToken(TokenType_1.TokenType.LEFT_BRACE);
                break;
            case "}":
                this.addToken(TokenType_1.TokenType.RIGHT_BRACE);
                break;
            case ",":
                this.addToken(TokenType_1.TokenType.COMMA);
                break;
            case ".":
                this.addToken(TokenType_1.TokenType.DOT);
                break;
            case "-":
                this.addToken(TokenType_1.TokenType.MINUS);
                break;
            case "+":
                this.addToken(TokenType_1.TokenType.PLUS);
                break;
            case ";":
                this.addToken(TokenType_1.TokenType.SEMICOLON);
                break;
            case "*":
                this.addToken(TokenType_1.TokenType.STAR);
                break;
            default:
                this.error(this.line, "Unexpected character. " + char);
        }
    }
    addToken(type, literal) {
        const text = this.source.slice(this.start, this.current);
        if (literal === undefined) {
            return this.addToken(type, null);
        }
        this.tokens.push(new Token_1.Token(type, text, literal, this.line, this.start, this.current - this.start));
    }
    advance() {
        return this.source.charAt(this.current++);
    }
    isAtEnd() {
        return this.current >= this.source.length;
    }
}
exports.Scanner = Scanner;
//# sourceMappingURL=Scanner.js.map