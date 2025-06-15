"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lox = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = __importDefault(require("node:fs"));
const readline_1 = __importDefault(require("readline"));
const Scanner_1 = require("../Scanner");
const Parser_1 = require("../Parser");
const Token_1 = require("./Token");
const TokenType_1 = require("./TokenType");
const interpreter_1 = require("./interpreter");
class Lox {
    sourceFolder;
    static hadError = false;
    static hadRuntimeError = false;
    interpreter = new interpreter_1.Interpreter();
    constructor(args, sourceFolder) {
        this.sourceFolder = sourceFolder;
        if (args.length > 1) {
            throw "Usage: jlox [script]";
        }
        if (args.length === 1) {
            this.runFile(args[0]);
        }
        else {
            this.runPrompt();
        }
    }
    runFile(sourcePath) {
        const filePath = node_path_1.default.join(__dirname, "../../", this.sourceFolder, sourcePath);
        if (!node_fs_1.default.existsSync(filePath)) {
            throw `File not found ${filePath}`;
        }
        try {
            const text = node_fs_1.default.readFileSync(filePath, "utf8").trim();
            this.run(text);
            if (Lox.hadError) {
                process.exit(65);
            }
            if (Lox.hadRuntimeError) {
                process.exit(70);
            }
        }
        catch (error) {
            throw error;
        }
    }
    getSource(rl) {
        return new Promise((resolve) => {
            rl.question("", (answer) => {
                resolve(answer);
            });
        });
    }
    async runPrompt() {
        const rl = readline_1.default.createInterface({
            input: process.stdin,
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
    }
    static error(arg, message) {
        if (typeof arg === "number") {
            Lox.report(arg, "", message);
        }
        if (arg instanceof Token_1.Token) {
            if (arg.type === TokenType_1.TokenType.EOF) {
                Lox.report(arg.line, " at end", message);
            }
            else {
                Lox.report(arg.line, " at '" + arg.lexeme + "'", message);
            }
        }
    }
    static report(line, where, message) {
        console.log(`[line ${line}] Error ${where}: ${message}`);
        Lox.hadError = true;
    }
    run(source) {
        const scanner = new Scanner_1.Scanner(source);
        const tokens = scanner.scanTokens();
        const parser = new Parser_1.Parser(tokens);
        debugger;
        const expr = parser.parse();
        console.log('expr', expr);
        if (Lox.hadError) {
            return;
        }
        if (!expr) {
            return;
        }
        this.interpreter.interpret(expr);
    }
    static runtimeError(error) {
        console.error(`${error.message} [line ${error.token.line}]`);
        Lox.hadRuntimeError = true;
    }
}
exports.Lox = Lox;
//# sourceMappingURL=Lox.js.map