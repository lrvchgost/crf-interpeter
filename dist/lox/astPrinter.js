"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AstPrinter = void 0;
class AstPrinter {
    visitUnary(expr) {
        return this.prettyPrint(expr.operator.lexeme, expr.right);
    }
    visitBinary(expr) {
        return this.prettyPrint(expr.operator.lexeme, expr.left, expr.right);
    }
    visitGrouping(expr) {
        return this.prettyPrint('group', expr.expression);
    }
    visitLiteral(expr) {
        if (expr.value === null)
            return 'nil';
        return expr.value.toString();
    }
    print(expr) {
        return expr.visit(this);
    }
    prettyPrint(name, ...exprs) {
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
exports.AstPrinter = AstPrinter;
//# sourceMappingURL=astPrinter.js.map