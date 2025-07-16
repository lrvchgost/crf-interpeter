"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resolver = void 0;
const Expr_1 = require("./Expr");
const Lox_1 = require("./Lox");
var FunctionType;
(function (FunctionType) {
    FunctionType[FunctionType["None"] = 0] = "None";
    FunctionType[FunctionType["Function"] = 1] = "Function";
    FunctionType[FunctionType["Method"] = 2] = "Method";
    FunctionType[FunctionType["Initializer"] = 3] = "Initializer";
})(FunctionType || (FunctionType = {}));
var ClassType;
(function (ClassType) {
    ClassType[ClassType["None"] = 0] = "None";
    ClassType[ClassType["Class"] = 2] = "Class";
})(ClassType || (ClassType = {}));
class Scopes {
    array = [];
    push(scope) {
        this.array.push(scope);
        return this;
    }
    get(i) {
        return this.array[i];
    }
    pop() {
        return this.array.pop();
    }
    peek() {
        return this.array[this.array.length - 1];
    }
    isEmpty() {
        return !this.array.length;
    }
    size() {
        return this.array.length;
    }
}
class Resolver {
    interpreter;
    scopes = new Scopes();
    currentFunction = FunctionType.None;
    currentClass = ClassType.None;
    constructor(interpreter) {
        this.interpreter = interpreter;
    }
    visitBlock(stmt) {
        this.beginScope();
        this.resolve(stmt.statements);
        this.endScope();
    }
    resolve(arg) {
        if (Array.isArray(arg)) {
            for (const st of arg) {
                this.resolve(st);
            }
        }
        else {
            if (arg instanceof Expr_1.StmtBase) {
                arg.visit(this);
            }
            if (arg instanceof Expr_1.ExprBase) {
                arg.visit(this);
            }
        }
    }
    beginScope() {
        this.scopes.push(new Map());
    }
    endScope() {
        this.scopes.pop();
    }
    visitVar(stmt) {
        this.declare(stmt.name);
        if (stmt.initializer) {
            this.resolve(stmt.initializer);
        }
        this.define(stmt.name);
    }
    declare(name) {
        if (this.scopes.isEmpty()) {
            return;
        }
        const scope = this.scopes.peek();
        if (scope.has(name.lexeme)) {
            Lox_1.Lox.error(name, "Already a variable with this name is the scope.");
        }
        scope.set(name.lexeme, false);
    }
    define(name) {
        if (this.scopes.isEmpty()) {
            return;
        }
        const scope = this.scopes.peek();
        scope.set(name.lexeme, true);
    }
    visitVariable(expr) {
        if (!this.scopes.isEmpty() &&
            this.scopes.peek().get(expr.name.lexeme) === false) {
            Lox_1.Lox.error(expr.name, "Can't read local variable in its own initializer.");
        }
        this.resolveLocal(expr, expr.name);
    }
    visitThis(expr) {
        if (this.currentClass === ClassType.None) {
            Lox_1.Lox.error(expr.keyword, "Can't use 'this' outside of a class.");
        }
        this.resolveLocal(expr, expr.keyword);
    }
    resolveLocal(expr, name) {
        for (let i = this.scopes.size() - 1; i >= 0; i--) {
            if (this.scopes.get(i)?.has(name.lexeme)) {
                this.interpreter.resolve(expr, this.scopes.size() - 1 - i);
                return;
            }
        }
    }
    visitAssign(expr) {
        this.resolve(expr.value);
        this.resolveLocal(expr, expr.name);
    }
    visitGet(expr) {
        this.resolve(expr.object);
    }
    visitSet(expr) {
        this.resolve(expr.value);
        this.resolve(expr.object);
    }
    visitClass(stmt) {
        const enclosingClass = this.currentClass;
        this.currentClass = ClassType.Class;
        this.declare(stmt.name);
        this.define(stmt.name);
        this.beginScope();
        this.scopes.peek().set("this", true);
        for (const method of stmt.methods) {
            let declaration = FunctionType.Method;
            if (method.name.lexeme === "init") {
                declaration = FunctionType.Initializer;
            }
            this.resolveFunction(method, declaration);
        }
        this.endScope();
        this.currentClass = enclosingClass;
    }
    visitFunction(stmt) {
        this.declare(stmt.name);
        this.define(stmt.name);
        this.resolveFunction(stmt, FunctionType.Function);
    }
    resolveFunction(fn, type) {
        const enslosingFunction = this.currentFunction;
        this.currentFunction = type;
        this.beginScope();
        for (const param of fn.params) {
            this.declare(param);
            this.define(param);
        }
        this.resolve(fn.body);
        this.endScope();
        this.currentFunction = enslosingFunction;
    }
    visitExpression(stmt) {
        this.resolve(stmt.expression);
    }
    visitIf(stmt) {
        this.resolve(stmt.condition);
        this.resolve(stmt.thenBranch);
        if (stmt.elseBranch) {
            this.resolve(stmt.elseBranch);
        }
    }
    visitPrint(stmt) {
        this.resolve(stmt.expression);
    }
    visitReturn(stmt) {
        if (this.currentFunction === FunctionType.None) {
            Lox_1.Lox.error(stmt.keyword, "Can't return from top level code.");
        }
        if (stmt.value) {
            if (this.currentFunction === FunctionType.Initializer) {
                Lox_1.Lox.error(stmt.keyword, "Can't return a value from an initializer.");
            }
            this.resolve(stmt.value);
        }
    }
    visitWhile(stmt) {
        this.resolve(stmt.condition);
        this.resolve(stmt.body);
    }
    visitBinary(expr) {
        this.resolve(expr.left);
        this.resolve(expr.right);
    }
    visitCall(expr) {
        this.resolve(expr.calle);
        for (const arg of expr.args) {
            this.resolve(arg);
        }
    }
    visitGrouping(expr) {
        this.resolve(expr.expression);
    }
    visitLiteral() {
        return;
    }
    visitLogical(expr) {
        this.resolve(expr.left);
        this.resolve(expr.right);
    }
    visitUnary(expr) {
        this.resolve(expr.right);
    }
}
exports.Resolver = Resolver;
//# sourceMappingURL=resolver.js.map