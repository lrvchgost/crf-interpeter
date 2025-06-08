import { RuntimeError } from "./error";
import {
  Binary,
  Expr,
  Expression,
  Grouping,
  Literal,
  Print,
  Stmt,
  Unary,
  Visitor,
} from "./Expr";
import { Lox } from "./Lox";
import { Token } from "./Token";
import { TokenType } from "./TokenType";
import { Value } from "./types";

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

  throw new RuntimeError(operator, "Operands must be a numbers.");
};

export class Interpreter implements Visitor<Value> {
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

  evaluate(expr: Expr | Stmt): Value {
    return expr.visit(this);
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
