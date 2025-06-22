import path from "node:path";
import fs from "node:fs";
import readline from "readline";
import { Scanner } from "../Scanner";
// import {Reporter} from "./Reporter";
import { Parser } from "../Parser";
// import {AstPrinter} from "./astPrinter";
import { Token } from "./Token";
import { TokenType } from "./TokenType";
import { RuntimeError } from "./error";
import { Interpreter } from "./interpreter";

export class Lox {
  static hadError = false;
  static hadRuntimeError = false;
  interpreter = new Interpreter();

  constructor(args: string[], private sourceFolder: string) {
    // console.log(args)
    if (args.length > 1) {
      throw "Usage: jlox [script]";
    }

    if (args.length === 1) {
      this.runFile(args[0]);
    } else {
      this.runPrompt();
    }
  }

  runFile(sourcePath: string) {
    const filePath = path.join(
      __dirname,
      "../../",
      this.sourceFolder,
      sourcePath
    );

    if (!fs.existsSync(filePath)) {
      throw `File not found ${filePath}`;
    }

    try {
      const text = fs.readFileSync(filePath, "utf8").trim();

      this.run(text);

      if (Lox.hadError) {
        process.exit(65);
      }
      if (Lox.hadRuntimeError) {
        process.exit(70);
      }
    } catch (error) {
      throw error;
    }
  }

  getSource(rl: readline.Interface) {
    return new Promise<string>((resolve) => {
      rl.question("", (answer) => {
        resolve(answer);
      });
    });
  }

  async runPrompt() {
    const rl = readline.createInterface({
      input: process.stdin,
      // output: process.stdout,
    });

    let text = "";

    while (true) {
      const line = await this.getSource(rl);

      if (line === "null") {
        break;
      }

      text += line + "\n";
    }

    this.run(text);
    Lox.hadError = false;
    // rl.close();
  }

  static error(line: number, message: string): void;
  static error(token: Token, message: string): void;
  static error(arg: number | Token, message: string) {
    if (typeof arg === "number") {
      Lox.report(arg, "", message);
    }

    if (arg instanceof Token) {
      if (arg.type === TokenType.EOF) {
        Lox.report(arg.line, " at end", message);
      } else {
        Lox.report(arg.line, " at '" + arg.lexeme + "'", message);
      }
    }
  }

  static report(line: number, where: string, message: string) {
    console.log(`[Lox] [line ${line}] Error ${where}: ${message}`);

    Lox.hadError = true;
  }

  run(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();
    // console.log(tokens)
    const parser = new Parser(tokens);

    const expr = parser.parse();

    // console.log(Lox.hadError);
    // console.log('expr', expr);

    if (Lox.hadError) {
      return;
    }

    if (!expr) {
      return;
    }

    this.interpreter.interpret(expr);
  }

  static runtimeError(error: RuntimeError) {
    console.error(`${error.message} [line ${error.token.line}]`);
    Lox.hadRuntimeError = true;
  }
}
