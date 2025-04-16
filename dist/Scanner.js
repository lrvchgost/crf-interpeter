"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scanner = void 0;
const Token_1 = require("./lox/Token");
const TokenType_1 = require("./lox/TokenType");
class Scanner {
    source;
    tokens = [];
    start = 0;
    current = 0;
    line = 1;
    constructor(source) {
        this.source = source;
        console.log(source);
    }
    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanTokens();
        }
        this.tokens.push(new Token_1.Token(TokenType_1.TokenType.EOF, "", null, this.line, this.start, 0));
        return this.tokens;
    }
    isAtEnd() { return true; }
}
exports.Scanner = Scanner;
//# sourceMappingURL=Scanner.js.map