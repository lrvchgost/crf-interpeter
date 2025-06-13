import { Token } from './Token';


export type Visitor<T> = {
	visitBinary: (binaryNode: Binary) => T;
	visitGrouping: (groupingNode: Grouping) => T;
	visitLiteral: (literalNode: Literal) => T;
	visitUnary: (unaryNode: Unary) => T;
	visitVariable: (variableNode: Variable) => T;
	visitExpression: (expressionNode: Expression) => T;
	visitPrint: (printNode: Print) => T;
	visitVar: (varNode: Var) => T;

}

abstract class AST {
    abstract visit<T>(visitor: Visitor<T>): T
}

export type Expr = Binary | Grouping | Literal | Unary | Variable;

export type Stmt = Expression | Print | Var;


export class Binary extends AST {
	left: Expr;
	operator: Token;
	right: Expr;

	constructor(left: Expr, operator: Token, right: Expr) {
		super();

		this.left = left;
		this.operator = operator;
		this.right = right;
	}

    visit<T>(visitor: Visitor<T>) {
        return visitor.visitBinary(this);
    }
}

export class Grouping extends AST {
	expression: Expr;

	constructor(expression: Expr) {
		super();

		this.expression = expression;
	}

    visit<T>(visitor: Visitor<T>) {
        return visitor.visitGrouping(this);
    }
}

export class Literal extends AST {
	value: number | string | boolean | null;

	constructor(value: number | string | boolean | null) {
		super();

		this.value = value;
	}

    visit<T>(visitor: Visitor<T>) {
        return visitor.visitLiteral(this);
    }
}

export class Unary extends AST {
	operator: Token;
	right: Expr;

	constructor(operator: Token, right: Expr) {
		super();

		this.operator = operator;
		this.right = right;
	}

    visit<T>(visitor: Visitor<T>) {
        return visitor.visitUnary(this);
    }
}

export class Variable extends AST {
	name: Token;

	constructor(name: Token) {
		super();

		this.name = name;
	}

    visit<T>(visitor: Visitor<T>) {
        return visitor.visitVariable(this);
    }
}


export class Expression extends AST {
	expression: Expr;

	constructor(expression: Expr) {
		super();

		this.expression = expression;
	}

    visit<T>(visitor: Visitor<T>) {
        return visitor.visitExpression(this);
    }
}

export class Print extends AST {
	expression: Expr;

	constructor(expression: Expr) {
		super();

		this.expression = expression;
	}

    visit<T>(visitor: Visitor<T>) {
        return visitor.visitPrint(this);
    }
}

export class Var extends AST {
	name: Token;
	initializer?: Expr;

	constructor(name: Token, initializer?: Expr) {
		super();

		this.name = name;
		this.initializer = initializer;
	}

    visit<T>(visitor: Visitor<T>) {
        return visitor.visitVar(this);
    }
}

