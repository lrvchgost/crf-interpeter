"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
class Token {
    type;
    lexeme;
    line;
    literal;
    start;
    length;
    constructor(type, lexeme, literal, line, start, length) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
        this.start = start;
        this.length = length;
    }
    toString() {
        return `${this.type} ${this.lexeme} ${this.literal}`;
    }
}
exports.Token = Token;
//# sourceMappingURL=Token.js.map