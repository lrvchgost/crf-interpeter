"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reporter = void 0;
const Token_1 = require("./Token");
const TokenType_1 = require("./TokenType");
class Reporter {
    hadError = false;
    error(arg, message) {
        if (typeof arg === "number") {
            this.report(arg, "", message);
        }
        if (arg instanceof Token_1.Token) {
            if (arg.type === TokenType_1.TokenType.EOF) {
                this.report(arg.line, " at end", message);
            }
            else {
                this.report(arg.line, " at '" + arg.lexeme + "' ", message);
            }
        }
    }
    report(line, where, message) {
        console.log(`[line ${line}] Error ${where}: ${message}`);
        this.hadError = true;
    }
}
exports.Reporter = Reporter;
//# sourceMappingURL=Reporter.js.map