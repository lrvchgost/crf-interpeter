"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoxFunction = void 0;
const types_1 = require("./types");
const Environment_1 = require("./Environment");
class LoxFunction extends types_1.LoxCallable {
    declaration;
    closure;
    isInitializer = false;
    constructor(declaration, closure, isInitializer) {
        super();
        this.declaration = declaration;
        this.closure = closure;
        this.isInitializer = isInitializer;
    }
    call(interpreter, ...argArray) {
        const environment = new Environment_1.Envirnonment(this.closure);
        for (let i = 0; i < this.declaration.params.length; i++) {
            environment.define(this.declaration.params[i].lexeme, argArray[i]);
        }
        try {
            interpreter.executeBlock(this.declaration.body, environment);
        }
        catch (returnValue) {
            if (this.isInitializer) {
                return this.closure.getAt(0, "this");
            }
            const value = returnValue;
            return value.value;
        }
        if (this.isInitializer) {
            return this.closure.getAt(0, "this");
        }
        return null;
    }
    arity() {
        return this.declaration.params.length;
    }
    toString() {
        return "<fn " + this.declaration.name.lexeme + ">";
    }
    bind(instance) {
        const environment = new Environment_1.Envirnonment(this.closure);
        environment.define("this", instance);
        return new LoxFunction(this.declaration, environment, this.isInitializer);
    }
}
exports.LoxFunction = LoxFunction;
//# sourceMappingURL=LoxFunction.js.map