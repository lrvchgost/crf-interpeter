import { Token } from './Token';


export type Visitor<T> = {
	visitAssign: (assignNode: Assign) => T;
	visitBinary: (binaryNode: Binary) => T;
	visitGrouping: (groupingNode: Grouping) => T;
	visitLiteral: (literalNode: Literal) => T;
	visitUnary: (unaryNode: Unary) => T;
	visitVariable: (variableNode: Variable) => T;
	visitLogical: (logicalNode: Logical) => T;
	visitBlock: (blockNode: Block) => T;
	visitExpression: (expressionNode: Expression) => T;
	visitPrint: (printNode: Print) => T;
	visitVar: (varNode: Var) => T;
	visitIf: (ifNode: If) => T;
	visitWhile: (whileNode: While) => T;

}

abstract class AST {
    abstract visit<T>(visitor: Visitor<T>): T
}

export type Expr = Assign | Binary | Grouping | Literal | Unary | Variable | Logical;

export type Stmt = Block | Expression | Print | Var | If | While;


export class Assign extends AST {
	name: Token;
	value: Expr;

	constructor(name: Token, value: Expr) {
		super();

		this.name = name;
		this.value = value;
	}

    visit<T>(visitor: Visitor<T>) {
        return visitor.visitAssign(this);
    }
}

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

export class Logical extends AST {
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
        return visitor.visitLogical(this);
    }
}


export class Block extends AST {
	statements: Stmt[];

	constructor(statements: Stmt[]) {
		super();

		this.statements = statements;
	}

    visit<T>(visitor: Visitor<T>) {
        return visitor.visitBlock(this);
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

export class If extends AST {
	condition: Expr;
	thenBranch: Stmt;
	elseBranch?: Stmt;

	constructor(condition: Expr, thenBranch: Stmt, elseBranch?: Stmt) {
		super();

		this.condition = condition;
		this.thenBranch = thenBranch;
		this.elseBranch = elseBranch;
	}

    visit<T>(visitor: Visitor<T>) {
        return visitor.visitIf(this);
    }
}

export class While extends AST {
	condition: Expr;
	body: Stmt;

	constructor(condition: Expr, body: Stmt) {
		super();

		this.condition = condition;
		this.body = body;
	}

    visit<T>(visitor: Visitor<T>) {
        return visitor.visitWhile(this);
    }
}

