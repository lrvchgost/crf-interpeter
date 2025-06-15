"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.While = exports.If = exports.Var = exports.Print = exports.Expression = exports.Block = exports.Logical = exports.Variable = exports.Unary = exports.Literal = exports.Grouping = exports.Binary = exports.Assign = void 0;
class AST {
}
class Assign extends AST {
    name;
    value;
    constructor(name, value) {
        super();
        this.name = name;
        this.value = value;
    }
    visit(visitor) {
        return visitor.visitAssign(this);
    }
}
exports.Assign = Assign;
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
class Logical extends AST {
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
        return visitor.visitLogical(this);
    }
}
exports.Logical = Logical;
class Block extends AST {
    statements;
    constructor(statements) {
        super();
        this.statements = statements;
    }
    visit(visitor) {
        return visitor.visitBlock(this);
    }
}
exports.Block = Block;
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
class If extends AST {
    condition;
    thenBranch;
    elseBranch;
    constructor(condition, thenBranch, elseBranch) {
        super();
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }
    visit(visitor) {
        return visitor.visitIf(this);
    }
}
exports.If = If;
class While extends AST {
    condition;
    body;
    constructor(condition, body) {
        super();
        this.condition = condition;
        this.body = body;
    }
    visit(visitor) {
        return visitor.visitWhile(this);
    }
}
exports.While = While;
//# sourceMappingURL=Expr.js.map