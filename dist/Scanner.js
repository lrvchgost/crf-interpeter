"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scanner = void 0;
const Lox_1 = require("./lox/Lox");
const Token_1 = require("./lox/Token");
const TokenType_1 = require("./lox/TokenType");
class Scanner {
    source;
    tokens = [];
    start = 0;
    current = 0;
    line = 1;
    static keywords = new Map([
        ["and", TokenType_1.TokenType.AND],
        ["class", TokenType_1.TokenType.CLASS],
        ["else", TokenType_1.TokenType.ELSE],
        ["for", TokenType_1.TokenType.FOR],
        ["fun", TokenType_1.TokenType.FUN],
        ["if", TokenType_1.TokenType.IF],
        ["nil", TokenType_1.TokenType.NIL],
        ["or", TokenType_1.TokenType.OR],
        ["print", TokenType_1.TokenType.PRINT],
        ["return", TokenType_1.TokenType.RETURN],
        ["super", TokenType_1.TokenType.SUPER],
        ["this", TokenType_1.TokenType.THIS],
        ["true", TokenType_1.TokenType.TRUE],
        ["var", TokenType_1.TokenType.VAR],
        ["while", TokenType_1.TokenType.WHILE],
    ]);
    constructor(source) {
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
    getCurrentChar() {
        return this.source.charAt(this.current);
    }
    match(expected) {
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
            case "!":
                this.addToken(this.match("=") ? TokenType_1.TokenType.BANG_EQUAL : TokenType_1.TokenType.BANG);
                break;
            case "=":
                this.addToken(this.match("=") ? TokenType_1.TokenType.EQUAL_EQUAL : TokenType_1.TokenType.EQUAL);
                break;
            case "<":
                this.addToken(this.match("=") ? TokenType_1.TokenType.LESS_EQUAL : TokenType_1.TokenType.LESS);
                break;
            case ">":
                this.addToken(this.match("=") ? TokenType_1.TokenType.GREATER_EQUAL : TokenType_1.TokenType.GREATER);
                break;
            case "/":
                if (this.match("/")) {
                    while (this.peek() !== "\n" && !this.isAtEnd()) {
                        this.advance();
                    }
                }
                else {
                    this.addToken(TokenType_1.TokenType.SLASH);
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
                }
                else if (this.isAlpha(char)) {
                    this.identifier();
                }
                else {
                    Lox_1.Lox.error(this.line, "[Scanner]: Unexpected character. " + char);
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
    getTextPiece(start, end) {
        return this.source.slice(start, end);
    }
    addToken(type, literal) {
        const text = this.getTextPiece(this.start, this.current);
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
    string() {
        while (this.peek() !== '"' && !this.isAtEnd()) {
            if (this.peek() === "\n") {
                this.line++;
            }
            this.advance();
        }
        if (this.isAtEnd()) {
            return Lox_1.Lox.error(this.line, "Unterminated string");
        }
        this.advance();
        const value = this.getTextPiece(this.start + 1, this.current - 1);
        this.addToken(TokenType_1.TokenType.STRING, value);
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
        this.addToken(TokenType_1.TokenType.NUMBER, Number(this.getTextPiece(this.start, this.current)));
    }
    identifier() {
        while (this.isAlphaNumeric(this.peek())) {
            this.advance();
        }
        const text = this.getTextPiece(this.start, this.current);
        let type = Scanner.keywords.get(text);
        if (type === undefined) {
            type = TokenType_1.TokenType.IDENTIFIER;
        }
        this.addToken(type);
    }
    isDigit(char) {
        return char >= "0" && char <= "9";
    }
    isAlpha(char) {
        return ((char >= "a" && char <= "z") ||
            (char >= "A" && char <= "Z") ||
            char === "_");
    }
    isAlphaNumeric(char) {
        return this.isAlpha(char) || this.isDigit(char);
    }
}
exports.Scanner = Scanner;
//# sourceMappingURL=Scanner.js.map