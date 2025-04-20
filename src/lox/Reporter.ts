import { Token } from "./Token";
import { TokenType } from "./TokenType";

export class Reporter {
  hadError = false;

  error(line: number, message: string): void;
  error(token: Token, message: string): void;
  error(arg: number | Token, message: string) {
    if (typeof arg === "number") {
      this.report(arg, "", message);
    }

    if (arg instanceof Token) {
      if (arg.type === TokenType.EOF) {
        this.report(arg.line, " at end", message);
      } else {
        this.report(arg.line, " at '" + arg.lexeme + "'", message);
      }
    }
  }

  report(line: number, where: string, message: string) {
    console.log(`[line ${line}] Error ${where}: ${message}`);

    this.hadError = true;
  }
}
