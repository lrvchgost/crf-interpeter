"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = exports.checkNumberOperands = exports.checkNumberOperand = exports.isEqual = exports.isTruthy = exports.double = void 0;
const Environment_1 = require("./Environment");
const error_1 = require("./error");
const Lox_1 = require("./Lox");
const LoxClass_1 = require("./LoxClass");
const LoxClock_1 = require("./LoxClock");
const LoxFunction_1 = require("./LoxFunction");
const ReturnTrhow_1 = require("./ReturnTrhow");
const TokenType_1 = require("./TokenType");
const types_1 = require("./types");
const double = (value) => {
    return Number(value);
};
exports.double = double;
const isTruthy = (value) => {
    if (value === null) {
        return false;
    }
    if (typeof value === "boolean") {
        return Boolean(value);
    }
    return false;
};
exports.isTruthy = isTruthy;
const isEqual = (a, b) => {
    if (a === null && b === null) {
        return false;
    }
    if (a === null) {
        return false;
    }
    return a === b;
};
exports.isEqual = isEqual;
const checkNumberOperand = (operator, operand) => {
    if (typeof operand === "number") {
        return;
    }
    throw new error_1.RuntimeError(operator, "Operand must be a number.");
};
exports.checkNumberOperand = checkNumberOperand;
const checkNumberOperands = (operator, left, right) => {
    if (typeof left === "number" && typeof right === "number") {
        return;
    }
    throw new error_1.RuntimeError(operator, "Operands must be numbers.");
};
exports.checkNumberOperands = checkNumberOperands;
class Interpreter {
    globals = new Environment_1.Envirnonment();
    locals = new Map();
    environment = this.globals;
    constructor() {
        this.globals.define("clock", new LoxClock_1.LoxClock());
    }
    visitLiteral(expr) {
        return expr.value;
    }
    visitGrouping(expr) {
        return this.evaluate(expr.expression);
    }
    visitBinary(expr) {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);
        switch (expr.operator.type) {
            case TokenType_1.TokenType.MINUS: {
                (0, exports.checkNumberOperands)(expr.operator, left, right);
                return (0, exports.double)(left) - (0, exports.double)(right);
            }
            case TokenType_1.TokenType.SLASH: {
                (0, exports.checkNumberOperands)(expr.operator, left, right);
                return (0, exports.double)(left) / (0, exports.double)(right);
            }
            case TokenType_1.TokenType.STAR: {
                (0, exports.checkNumberOperands)(expr.operator, left, right);
                return (0, exports.double)(left) * (0, exports.double)(right);
            }
            case TokenType_1.TokenType.PLUS: {
                if (typeof left === "number" && typeof right === "number") {
                    (0, exports.checkNumberOperands)(expr.operator, left, right);
                    return (0, exports.double)(left) + (0, exports.double)(right);
                }
                if (typeof left === "string" && typeof right === "string") {
                    return String(left) + String(right);
                }
                throw new error_1.RuntimeError(expr.operator, "Operands must be two numbers or two strings.");
            }
            case TokenType_1.TokenType.GREATER: {
                (0, exports.checkNumberOperands)(expr.operator, left, right);
                return (0, exports.double)(left) > (0, exports.double)(right);
            }
            case TokenType_1.TokenType.GREATER_EQUAL: {
                (0, exports.checkNumberOperands)(expr.operator, left, right);
                return (0, exports.double)(left) >= (0, exports.double)(right);
            }
            case TokenType_1.TokenType.LESS: {
                (0, exports.checkNumberOperands)(expr.operator, left, right);
                return (0, exports.double)(left) < (0, exports.double)(right);
            }
            case TokenType_1.TokenType.LESS_EQUAL: {
                (0, exports.checkNumberOperands)(expr.operator, left, right);
                return (0, exports.double)(left) <= (0, exports.double)(right);
            }
            case TokenType_1.TokenType.EQUAL_EQUAL: {
                return (0, exports.isEqual)(left, right);
            }
            case TokenType_1.TokenType.BANG_EQUAL: {
                return !(0, exports.isEqual)(left, right);
            }
        }
        return null;
    }
    visitUnary(expr) {
        const right = this.evaluate(expr.right);
        switch (expr.operator.type) {
            case TokenType_1.TokenType.MINUS: {
                (0, exports.checkNumberOperand)(expr.operator, right);
                return -(0, exports.double)(right);
            }
            case TokenType_1.TokenType.BANG: {
                return !(0, exports.isTruthy)(right);
            }
        }
        return null;
    }
    visitExpression(stmt) {
        return this.evaluate(stmt.expression);
    }
    visitPrint(stmt) {
        const expression = this.evaluate(stmt.expression);
        console.log(this.stringify(expression));
    }
    visitVariable(expr) {
        return this.lookUpVariable(expr.name, expr);
    }
    lookUpVariable(name, expr) {
        const distance = this.locals.get(expr);
        if (distance !== undefined) {
            return this.environment.getAt(distance, name.lexeme);
        }
        else {
            return this.globals.get(name);
        }
    }
    visitVar(stmt) {
        let value = null;
        if (stmt.initializer) {
            value = this.evaluate(stmt.initializer);
        }
        this.environment.define(stmt.name.lexeme, value);
    }
    visitAssign(expr) {
        const value = this.evaluate(expr.value);
        const distance = this.locals.get(expr);
        if (distance !== undefined) {
            this.environment.assignAt(distance, expr.name, value);
        }
        else {
            this.globals.assign(expr.name, value);
        }
        return value;
    }
    visitBlock(stmt) {
        this.executeBlock(stmt.statements, new Environment_1.Envirnonment(this.environment));
    }
    visitIf(stmt) {
        if (Boolean(this.evaluate(stmt.condition)) === true) {
            this.execute(stmt.thenBranch);
        }
        else if (stmt.elseBranch !== undefined) {
            this.execute(stmt.elseBranch);
        }
    }
    visitLogical(expr) {
        const left = this.evaluate(expr.left);
        if (expr.operator.type === TokenType_1.TokenType.OR) {
            if (Boolean(left) === true)
                return left;
        }
        else {
            if (Boolean(left) !== true)
                return left;
        }
        return this.evaluate(expr.right);
    }
    visitWhile(stmt) {
        while (Boolean(this.evaluate(stmt.condition))) {
            this.execute(stmt.body);
        }
    }
    visitSet(expr) {
        const object = this.evaluate(expr.object);
        if (!(object instanceof LoxClass_1.LoxInstance)) {
            throw new error_1.RuntimeError(expr.name, "Only instances have fields.");
        }
        const value = this.evaluate(expr.value);
        object.set(expr.name, value);
        return value;
    }
    visitGet(expr) {
        const object = this.evaluate(expr.object);
        if (object instanceof LoxClass_1.LoxInstance) {
            return object.get(expr.name);
        }
        throw new error_1.RuntimeError(expr.name, "Only instances have properties.");
    }
    visitCall(expr) {
        const callee = this.evaluate(expr.calle);
        const args = [];
        for (const arg of expr.args) {
            args.push(this.evaluate(arg));
        }
        if (!(callee instanceof types_1.LoxCallable)) {
            throw new error_1.RuntimeError(expr.paren, "Can only call functions and classes");
        }
        const fn = callee;
        if (args.length !== fn.arity()) {
            throw new error_1.RuntimeError(expr.paren, "Expected " + fn.arity() + " arguments, but got " + args.length + ".");
        }
        return fn.call(this, ...args);
    }
    visitClass(stmt) {
        this.environment.define(stmt.name.lexeme, null);
        const methods = new Map();
        for (const method of stmt.methods) {
            const fn = new LoxFunction_1.LoxFunction(method, this.environment);
            methods.set(method.name.lexeme, fn);
        }
        const kclass = new LoxClass_1.LoxClass(stmt.name.lexeme, methods);
        this.environment.assign(stmt.name, kclass);
        return null;
    }
    visitFunction(stmt) {
        const fn = new LoxFunction_1.LoxFunction(stmt, this.environment);
        this.environment.define(stmt.name.lexeme, fn);
        return null;
    }
    visitReturn(stmt) {
        let value = null;
        if (stmt.value !== undefined) {
            value = this.evaluate(stmt.value);
        }
        throw new ReturnTrhow_1.ReturnTrhow(value);
    }
    visitThis(expr) {
        return this.lookUpVariable(expr.keyword, expr);
    }
    evaluate(expr) {
        return expr.visit(this);
    }
    execute(stmt) {
        stmt.visit(this);
    }
    executeBlock(statements, environment) {
        const previous = this.environment;
        try {
            this.environment = environment;
            for (const statement of statements) {
                this.execute(statement);
            }
        }
        finally {
            this.environment = previous;
        }
    }
    resolve(expr, depth) {
        this.locals.set(expr, depth);
    }
    interpret(statemets) {
        try {
            for (let statement of statemets) {
                this.execute(statement);
            }
        }
        catch (error) {
            const e = error;
            Lox_1.Lox.runtimeError(e);
        }
    }
    stringify(value) {
        if (value === null) {
            return "nil";
        }
        return value?.toString();
    }
}
exports.Interpreter = Interpreter;
//# sourceMappingURL=interpreter.js.map