import { Envirnonment } from "./Environment";
import { RuntimeError } from "./error";
import {
  Assign,
  Binary,
  Block,
  Call,
  Expr,
  Expression,
  Grouping,
  If,
  Literal,
  Logical,
  Print,
  Stmt,
  Unary,
  Var,
  Variable,
  Visitor,
  While,
  Function,
  Return,
} from "./Expr";
import { Lox } from "./Lox";
import {LoxClock} from "./LoxClock";
import {LoxFunction} from "./LoxFunction";
import {ReturnTrhow} from "./ReturnTrhow";
import { Token } from "./Token";
import { TokenType } from "./TokenType";
import { LoxCallable, Value } from "./types";

export const double = (value: Value): number => {
  return Number(value);
};

export const isTruthy = (value: Value): boolean => {
  if (value === null) {
    return false;
  }

  if (typeof value === "boolean") {
    return Boolean(value);
  }

  return false;
};

export const isEqual = (a: Value, b: Value): boolean => {
  if (a === null && b === null) {
    return false;
  }
  if (a === null) {
    return false;
  }

  return a === b;
};

export const checkNumberOperand = (operator: Token, operand: Value) => {
  if (typeof operand === "number") {
    return;
  }

  throw new RuntimeError(operator, "Operand must be a number.");
};

export const checkNumberOperands = (
  operator: Token,
  left: Value,
  right: Value
) => {
  if (typeof left === "number" && typeof right === "number") {
    return;
  }

  throw new RuntimeError(operator, "Operands must be numbers.");
};

export class Interpreter implements Visitor<Value> {
  public globals = new Envirnonment();
  private environment = this.globals;

  constructor() {
    this.globals.define("clock", new LoxClock());
  }

  visitLiteral(expr: Literal): Value {
    return expr.value;
  }

  visitGrouping(expr: Grouping): Value {
    return this.evaluate(expr.expression);
  }

  visitBinary(expr: Binary): Value {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.MINUS: {
        checkNumberOperands(expr.operator, left, right);
        return double(left) - double(right);
      }
      case TokenType.SLASH: {
        checkNumberOperands(expr.operator, left, right);
        return double(left) / double(right);
      }
      case TokenType.STAR: {
        checkNumberOperands(expr.operator, left, right);
        return double(left) * double(right);
      }
      case TokenType.PLUS: {
        if (typeof left === "number" && typeof right === "number") {
          checkNumberOperands(expr.operator, left, right);
          return double(left) + double(right);
        }
        if (typeof left === "string" && typeof right === "string") {
          return String(left) + String(right);
        }

        throw new RuntimeError(
          expr.operator,
          "Operands must be two numbers or two strings."
        );
      }
      case TokenType.GREATER: {
        checkNumberOperands(expr.operator, left, right);
        return double(left) > double(right);
      }
      case TokenType.GREATER_EQUAL: {
        checkNumberOperands(expr.operator, left, right);
        return double(left) >= double(right);
      }
      case TokenType.LESS: {
        checkNumberOperands(expr.operator, left, right);
        return double(left) < double(right);
      }
      case TokenType.LESS_EQUAL: {
        checkNumberOperands(expr.operator, left, right);
        return double(left) <= double(right);
      }
      case TokenType.EQUAL_EQUAL: {
        return isEqual(left, right);
      }
      case TokenType.BANG_EQUAL: {
        return !isEqual(left, right);
      }
    }

    return null;
  }

  visitUnary(expr: Unary): Value {
    const right = this.evaluate(expr.right);

    switch (expr.operator.type) {
      case TokenType.MINUS: {
        checkNumberOperand(expr.operator, right);
        return -double(right);
      }
      case TokenType.BANG: {
        return !isTruthy(right);
      }
    }

    return null;
  }

  visitExpression(stmt: Expression): void {
    this.evaluate(stmt.expression);
  }

  visitPrint(stmt: Print): void {
    const expression = this.evaluate(stmt.expression);

    console.log(this.stringify(expression));
  }

  visitVariable(expr: Variable): Value {
    return this.environment.get(expr.name);
  }

  visitVar(stmt: Var): void {
    let value: Value = null;

    if (stmt.initializer) {
      value = this.evaluate(stmt.initializer);
    }

    this.environment.define(stmt.name.lexeme, value);
  }

  visitAssign(expr: Assign): Value {
    const value = this.evaluate(expr.value);

    this.environment.assign(expr.name, value);

    return value;
  }

  visitBlock(stmt: Block) {
    this.executeBlock(stmt.statements, new Envirnonment(this.environment));
  }

  visitIf(stmt: If) {
    if (Boolean(this.evaluate(stmt.condition)) === true) {
      this.execute(stmt.thenBranch);
    } else if (stmt.elseBranch !== undefined) {
      this.execute(stmt.elseBranch);
    }
  }

  visitLogical(expr: Logical) {
    const left = this.evaluate(expr.left);

    if (expr.operator.type === TokenType.OR) {
      if (Boolean(left) === true) return left;
    } else {
      if (Boolean(left) !== true) return left;
    }

    return this.evaluate(expr.right);
  }

  visitWhile(stmt: While) {
    while (Boolean(this.evaluate(stmt.condition))) {
      this.evaluate(stmt.body);
    }
  }

  visitCall(expr: Call) {
    const callee = this.evaluate(expr.calle);

    // console.log(callee)

    const args: Value[] = [];

    for (const arg of expr.args) {
      args.push(this.evaluate(arg));
    }

    if (!(callee instanceof LoxCallable)) {
      throw new RuntimeError(expr.paren, "Can only call functions and classes");
    }

    const fn: LoxCallable = callee as LoxCallable;

    if (args.length !== fn.arity()) {
      throw new RuntimeError(
        expr.paren,
        "Expected " + fn.arity() + " arguments, but got " + args.length + "."
      );
    }

    return fn.call(this, ...args);
  }

  visitFunction(stmt: Function) {
    const fn = new LoxFunction(stmt);

    this.environment.define(stmt.name.lexeme, fn);

    return null;
  }

  visitReturn(stmt: Return) {
    let value: Value = null;

    if (stmt.value !== undefined) {
      value = this.evaluate(stmt.value);
    }

    throw new ReturnTrhow(value);
  }

  evaluate(expr: Expr | Stmt): Value {
    return expr.visit(this);
  }

  execute(stmt: Stmt) {
    stmt.visit(this);
  }

  executeBlock(statements: Stmt[], environment: Envirnonment) {
    const previous = this.environment;

    try {
      this.environment = environment;

      for (const statement of statements) {
        this.execute(statement);
      }
    } finally {
      this.environment = previous;
    }
  }

  interpret(statemets: Stmt[]) {
    try {
      for (let statement of statemets) {
        this.evaluate(statement);
      }
    } catch (error) {
      const e = error as RuntimeError;

      Lox.runtimeError(e);
    }
  }

  stringify(value: Value) {
    if (value === null) {
      return "nil";
    }

    return value?.toString();
  }
}
