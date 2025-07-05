"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Function = exports.While = exports.If = exports.Var = exports.Return = exports.Print = exports.Expression = exports.Block = exports.Call = exports.Logical = exports.Variable = exports.Unary = exports.Literal = exports.Grouping = exports.Binary = exports.Assign = exports.ExprBase = exports.StmtBase = void 0;
class AST {
}
class StmtBase extends AST {
}
exports.StmtBase = StmtBase;
class ExprBase extends AST {
}
exports.ExprBase = ExprBase;
class Assign extends ExprBase {
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
class Binary extends ExprBase {
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
class Grouping extends ExprBase {
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
class Literal extends ExprBase {
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
class Unary extends ExprBase {
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
class Variable extends ExprBase {
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
class Logical extends ExprBase {
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
class Call extends ExprBase {
    calle;
    paren;
    args;
    constructor(calle, paren, args) {
        super();
        this.calle = calle;
        this.paren = paren;
        this.args = args;
    }
    visit(visitor) {
        return visitor.visitCall(this);
    }
}
exports.Call = Call;
class Block extends StmtBase {
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
class Expression extends StmtBase {
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
class Print extends StmtBase {
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
class Return extends StmtBase {
    keyword;
    value;
    constructor(keyword, value) {
        super();
        this.keyword = keyword;
        this.value = value;
    }
    visit(visitor) {
        return visitor.visitReturn(this);
    }
}
exports.Return = Return;
class Var extends StmtBase {
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
class If extends StmtBase {
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
class While extends StmtBase {
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
class Function extends StmtBase {
    name;
    params;
    body;
    constructor(name, params, body) {
        super();
        this.name = name;
        this.params = params;
        this.body = body;
    }
    visit(visitor) {
        return visitor.visitFunction(this);
    }
}
exports.Function = Function;
//# sourceMappingURL=Expr.js.map