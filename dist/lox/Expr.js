"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Var = exports.Print = exports.Expression = exports.Variable = exports.Unary = exports.Literal = exports.Grouping = exports.Binary = void 0;
class AST {
}
class Binary extends AST {
    left;
    operator;
    right;
    constructor(left, operator, right) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    visit(visitor) {
        return visitor.visitBinary(this);
    }
}
exports.Binary = Binary;
class Grouping extends AST {
    expression;
    constructor(expression) {
        super();
        this.expression = expression;
    }
    visit(visitor) {
        return visitor.visitGrouping(this);
    }
}
exports.Grouping = Grouping;
class Literal extends AST {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    visit(visitor) {
        return visitor.visitLiteral(this);
    }
}
exports.Literal = Literal;
class Unary extends AST {
    operator;
    right;
    constructor(operator, right) {
        super();
        this.operator = operator;
        this.right = right;
    }
    visit(visitor) {
        return visitor.visitUnary(this);
    }
}
exports.Unary = Unary;
class Variable extends AST {
    name;
    constructor(name) {
        super();
        this.name = name;
    }
    visit(visitor) {
        return visitor.visitVariable(this);
    }
}
exports.Variable = Variable;
class Expression extends AST {
    expression;
    constructor(expression) {
        super();
        this.expression = expression;
    }
    visit(visitor) {
        return visitor.visitExpression(this);
    }
}
exports.Expression = Expression;
class Print extends AST {
    expression;
    constructor(expression) {
        super();
        this.expression = expression;
    }
    visit(visitor) {
        return visitor.visitPrint(this);
    }
}
exports.Print = Print;
class Var extends AST {
    name;
    initializer;
    constructor(name, initializer) {
        super();
        this.name = name;
        this.initializer = initializer;
    }
    visit(visitor) {
        return visitor.visitVar(this);
    }
}
exports.Var = Var;
//# sourceMappingURL=Expr.js.map