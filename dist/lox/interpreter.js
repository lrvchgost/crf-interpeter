"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interpreter = exports.checkNumberOperands = exports.checkNumberOperand = exports.isEqual = exports.isTruthy = exports.double = void 0;
const Environment_1 = require("./Environment");
const error_1 = require("./error");
const Lox_1 = require("./Lox");
const TokenType_1 = require("./TokenType");
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
    environment = new Environment_1.Envirnonment();
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
        this.evaluate(stmt.expression);
    }
    visitPrint(stmt) {
        const expression = this.evaluate(stmt.expression);
        console.log(this.stringify(expression));
    }
    visitVariable(expr) {
        return this.environment.get(expr.name);
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
        this.environment.assign(expr.name, value);
        return value;
    }
    visitBlock(stmt) {
        debugger;
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
    interpret(statemets) {
        try {
            for (let statement of statemets) {
                this.evaluate(statement);
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