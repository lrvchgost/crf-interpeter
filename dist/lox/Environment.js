"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Envirnonment = void 0;
const error_1 = require("./error");
class Envirnonment {
    values = new Map();
    enclosing = null;
    constructor(enclosing = null) {
        this.enclosing = enclosing;
    }
    define(name, value) {
        this.values.set(name, value);
    }
    assign(name, value) {
        if (this.values.has(name.lexeme)) {
            this.values.set(name.lexeme, value);
            return;
        }
        if (this.enclosing !== null) {
            return this.enclosing.assign(name);
        }
        throw new error_1.RuntimeError(name, "Undefined vairable '" + name.lexeme + "'.");
    }
    get(name) {
        if (this.values.has(name.lexeme)) {
            return this.values.get(name.lexeme);
        }
        if (this.enclosing !== null) {
            return this.enclosing.get(name);
        }
        throw new error_1.RuntimeError(name, "Undefined vairable '" + name.lexeme + "'.");
    }
}
exports.Envirnonment = Envirnonment;
//# sourceMappingURL=Environment.js.map