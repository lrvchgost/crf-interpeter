import { Lox } from "./lox/Lox";

const args = process.argv.slice(2);

const sourceFolder = "source";

new Lox(args, sourceFolder);

// import {AstPrinter} from "./lox/astPrinter";
// import { Binary, Literal, Grouping, Unary } from "./lox/Expr";
// import { Token } from "./lox/Token";
// import { TokenType } from "./lox/TokenType";
//
// const expr = new Binary(
//   new Unary(new Token(TokenType.MINUS, "-", null, 1, 0, 0), new Literal(123)),
//   new Token(TokenType.STAR, "*", null, 1, 0, 0),
//   new Grouping(new Literal(45.67))
// );
//
// const printer = new AstPrinter();
//
// console.log(printer.print(expr));
