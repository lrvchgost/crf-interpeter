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
            return this.enclosing.assign(name, value);
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
    getAt(distance, name) {
        return this.ancestor(distance).values.get(name);
    }
    assignAt(distance, name, value) {
        return this.ancestor(distance).values.set(name.lexeme, value);
    }
    ancestor(distance) {
        let env = this;
        for (let i = 0; i < distance; i++) {
            env = env.enclosing;
        }
        return env;
    }
}
exports.Envirnonment = Envirnonment;
//# sourceMappingURL=Environment.js.map