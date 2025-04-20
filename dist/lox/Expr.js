"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unary = exports.Literal = exports.Grouping = exports.Binary = void 0;
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
//# sourceMappingURL=Expr.js.map