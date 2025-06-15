"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Envirnonment = void 0;
const error_1 = require("./error");
class Envirnonment {
    values = new Map();
    define(name, value) {
        this.values.set(name, value);
    }
    get(name) {
        if (this.values.has(name.lexeme)) {
            return this.values.get(name.lexeme);
        }
        throw new error_1.RuntimeError(name, "Undefined vairable '" + name.lexeme + "'.");
    }
}
exports.Envirnonment = Envirnonment;
//# sourceMappingURL=Environment.js.map