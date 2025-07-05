import {
  Block,
  Stmt,
  Visitor,
  Expr,
  ExprBase,
  StmtBase,
  Var,
  Variable,
  Assign,
  Expression,
  Function,
  If,
  Print,
  Return,
  While,
  Binary,
  Call,
  Grouping,
  Logical,
  Unary,
} from "./Expr";
import { Interpreter } from "./interpreter";
import { Lox } from "./Lox";
import { Token } from "./Token";
import { Value } from "./types";

enum FunctionType {
  None = 0,
  Function = 1,
}

class Scopes {
  private array: Map<string, boolean>[] = [];

  push(scope: Map<string, boolean>) {
    this.array.push(scope);
    return this;
  }

  get(i: number) {
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

export class Resolver implements Visitor<Value> {
  interpreter: Interpreter;
  scopes: Scopes = new Scopes();
  currentFunction = FunctionType.None;

  constructor(interpreter: Interpreter) {
    this.interpreter = interpreter;
  }

  visitBlock(stmt: Block) {
    this.beginScope();
    this.resolve(stmt.statements);
    this.endScope();
  }

  resolve(arg: Stmt | Expr | Stmt[]) {
    // debugger;
    if (Array.isArray(arg)) {
      for (const st of arg) {
        this.resolve(st);
      }
    } else {
      if (arg instanceof StmtBase) {
        arg.visit(this);
      }

      if (arg instanceof ExprBase) {
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

  visitVar(stmt: Var) {
    this.declare(stmt.name);

    if (stmt.initializer) {
      this.resolve(stmt.initializer);
    }

    this.define(stmt.name);
  }

  declare(name: Token) {
    if (this.scopes.isEmpty()) {
      return;
    }

    const scope = this.scopes.peek();

    if (scope.has(name.lexeme)) {
      Lox.error(name, "Already a variable with this name is the scope.");
    }

    scope.set(name.lexeme, false);
  }

  define(name: Token) {
    if (this.scopes.isEmpty()) {
      return;
    }

    const scope = this.scopes.peek();

    scope.set(name.lexeme, true);
  }

  visitVariable(expr: Variable) {
    if (
      !this.scopes.isEmpty() &&
      this.scopes.peek().get(expr.name.lexeme) === false
    ) {
      Lox.error(expr.name, "Can't read local variable in its own initializer.");
    }

    this.resolveLocal(expr, expr.name);
  }

  resolveLocal(expr: Expr, name: Token) {
    for (let i = this.scopes.size() - 1; i >= 0; i--) {
      if (this.scopes.get(i)?.has(name.lexeme)) {
        this.interpreter.resolve(expr, this.scopes.size() - 1 - i);
        return;
      }
    }
  }

  visitAssign(expr: Assign) {
    this.resolve(expr.value);
    this.resolveLocal(expr, expr.name);
  }

  visitFunction(stmt: Function) {
    this.declare(stmt.name);
    this.define(stmt.name);
    this.resolveFunction(stmt, FunctionType.Function);
  }

  resolveFunction(fn: Function, type: FunctionType) {
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

  visitExpression(stmt: Expression) {
    this.resolve(stmt.expression);
  }

  visitIf(stmt: If) {
    this.resolve(stmt.condition);
    this.resolve(stmt.thenBranch);

    if (stmt.elseBranch) {
      this.resolve(stmt.elseBranch);
    }
  }

  visitPrint(stmt: Print) {
    this.resolve(stmt.expression);
  }

  visitReturn(stmt: Return) {
    if (this.currentFunction === FunctionType.None) {
      Lox.error(stmt.keyword, "Can't return from top level code.");
    }

    if (stmt.value) {
      this.resolve(stmt.value);
    }
  }

  visitWhile(stmt: While) {
    this.resolve(stmt.condition);
    this.resolve(stmt.body);
  }

  visitBinary(expr: Binary) {
    this.resolve(expr.left);
    this.resolve(expr.right);
  }

  visitCall(expr: Call) {
    this.resolve(expr.calle);

    for (const arg of expr.args) {
      this.resolve(arg);
    }
  }

  visitGrouping(expr: Grouping) {
    this.resolve(expr.expression);
  }

  visitLiteral() {
    return;
  }

  visitLogical(expr: Logical) {
    this.resolve(expr.left);
    this.resolve(expr.right);
  }

  visitUnary(expr: Unary) {
    this.resolve(expr.right);
  }
}
