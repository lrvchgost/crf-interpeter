
import { Token } from './Token';


export type Visitor<T> = {
	visitBinary: (binary: Binary) => T;
	visitGrouping: (grouping: Grouping) => T;
	visitLiteral: (literal: Literal) => T;
	visitUnary: (unary: Unary) => T;

}

abstract class AST {
  abstract visit<T>(visitor: Visitor<T>): T
}

export type Expr = Binary | Grouping | Literal | Unary;

export class Binary extends AST {
	left: Expr;
	operator: Token;
	right: Expr;

	constructor(left: Expr, operator: Token, right: Expr) {
		super();

		this.left= left;
		this.operator= operator;
		this.right= right;

	}

    visit<T>(visitor: Visitor<T>) {
        return visitor.visitBinary(this);
    }
}

export class Grouping extends AST {
	expression: Expr;

	constructor(expression: Expr) {
		super();

		this.expression= expression;

	}

    visit<T>(visitor: Visitor<T>) {
        return visitor.visitGrouping(this);
    }
}

export class Literal extends AST {
	value: number | string | boolean | null;

	constructor(value: number | string | boolean | null) {
		super();

		this.value= value;

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

		this.operator= operator;
		this.right= right;

	}

    visit<T>(visitor: Visitor<T>) {
        return visitor.visitUnary(this);
    }
}

