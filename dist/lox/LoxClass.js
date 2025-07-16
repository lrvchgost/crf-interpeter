"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoxInstance = exports.LoxClass = void 0;
const error_1 = require("./error");
const types_1 = require("./types");
class LoxClass extends types_1.LoxCallable {
    name;
    methods = new Map();
    constructor(name, methods) {
        super();
        this.name = name;
        this.methods = methods;
    }
    call(interpreter, ...argArray) {
        const instance = new LoxInstance(this);
        const initializer = this.findMethod('init');
        if (initializer) {
            initializer.bind(instance).call(interpreter, ...argArray);
        }
        return instance;
    }
    arity() {
        const initializer = this.findMethod('init');
        if (!initializer) {
            return 0;
        }
        return initializer.arity();
    }
    toString() {
        return this.name;
    }
    findMethod(name) {
        if (this.methods.has(name)) {
            return this.methods.get(name);
        }
        return null;
    }
}
exports.LoxClass = LoxClass;
class LoxInstance {
    kclass;
    fields = new Map();
    constructor(kclass) {
        this.kclass = kclass;
    }
    toString() {
        return this.kclass.name + " instance";
    }
    get(name) {
        if (this.fields.has(name.lexeme)) {
            return this.fields.get(name.lexeme);
        }
        const method = this.kclass.findMethod(name.lexeme);
        if (method) {
            return method.bind(this);
        }
        throw new error_1.RuntimeError(name, "Undefined property '" +
            name.lexeme +
            "'. Accessing on an instance of the class '" +
            this.kclass.name +
            "'.");
    }
    set(name, value) {
        this.fields.set(name.lexeme, value);
    }
}
exports.LoxInstance = LoxInstance;
//# sourceMappingURL=LoxClass.js.map