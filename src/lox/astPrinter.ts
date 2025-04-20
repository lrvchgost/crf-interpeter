import { Visitor, Binary, Unary, Literal, Grouping, Expr } from './Expr';

export class AstPrinter implements Visitor<string> {
  visitUnary(expr: Unary) {
    return this.prettyPrint(expr.operator.lexeme, expr.right);
  }

  visitBinary(expr: Binary) {
    return this.prettyPrint(expr.operator.lexeme, expr.left, expr.right);
  }

  visitGrouping(expr: Grouping) {
    return this.prettyPrint('group', expr.expression);
  }

  visitLiteral(expr: Literal) {
    if (expr.value === null) return 'nil';

    return expr.value.toString();
  }

  print(expr: Expr) {
    return expr.visit(this);
  }

  prettyPrint(name: string, ...exprs: any[]) {
    let res = [];

    res.push('(');
    res.push(name);

    for (let e of exprs) {
      res.push(' ');
      res.push(e.visit(this));
    }

    res.push(')');

    return res.join(' ');
  }
}
