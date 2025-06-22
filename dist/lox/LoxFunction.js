"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoxFunction = void 0;
const types_1 = require("./types");
const Environment_1 = require("./Environment");
class LoxFunction extends types_1.LoxCallable {
    declaration;
    constructor(declaration) {
        super();
        this.declaration = declaration;
    }
    call(interpreter, ...argArray) {
        const environment = new Environment_1.Envirnonment(interpreter.globals);
        for (let i = 0; i < this.declaration.params.length; i++) {
            environment.define(this.declaration.params[i].lexeme, argArray[i]);
        }
        try {
            interpreter.executeBlock(this.declaration.body, environment);
        }
        catch (returnValue) {
            const value = returnValue;
            return value.value;
        }
        return null;
    }
    arity() {
        return this.declaration.params.length;
    }
    toString() {
        return "<fn " + this.declaration.name.lexeme + ">";
    }
}
exports.LoxFunction = LoxFunction;
//# sourceMappingURL=LoxFunction.js.map