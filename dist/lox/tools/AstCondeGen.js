"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const path_1 = __importDefault(require("path"));
const literal = "number | string | boolean | null";
const astConfig = {
    output: "Expr.ts",
    classes: [
        "Binary   = left: Expr, operator: Token, right: Expr",
        "Grouping = expression: Expr",
        `Literal  = value: ${literal}`,
        "Unary    = operator: Token, right: Expr",
    ],
};
const defineConstuctor = (params) => {
    let result = '';
    for (let p of params) {
        const [name, type] = p.split(':');
        result += `\t\tthis.${name.trim()}= ${name.trim()};\n`;
    }
    return result;
};
const defineType = (params) => {
    let result = '';
    for (let p of params) {
        const [name, type] = p.split(':');
        result += `\t${name.trim()}: ${type.trim()};\n`;
    }
    return result;
};
const defineClasses = () => {
    let cl = "";
    for (let c of astConfig.classes) {
        const [name, params] = c.split("=");
        cl += `export class ${name.trim()} extends AST {
${defineType(params.split(','))}
\tconstructor(${params.trim()}) {
\t\tsuper();

${defineConstuctor(params.split(','))}
\t}

    visit<T>(visitor: Visitor<T>) {
        return visitor.visit${name.trim()}(this);
    }
}\n\n`;
    }
    return cl;
};
const defintVisitorMethods = () => {
    let result = '';
    for (let c of astConfig.classes) {
        const name = c.split('=')[0].trim();
        result += `\tvisit${name}: (${name.toLowerCase()}: ${name}) => T;\n`;
    }
    return result;
};
const defineVisitorInterface = () => {
    const type = `
export type Visitor<T> = {
${defintVisitorMethods()}
}`;
    return type;
};
const base = `
import { Token } from './Token';

${defineVisitorInterface()}

abstract class AST {
  abstract visit<T>(visitor: Visitor<T>): T
}

type Expr = ${astConfig.classes
    .map((str) => str.split("=")[0].trim())
    .join(" | ")};

${defineClasses()}`;
const __dirname = path_1.default.resolve(path_1.default.dirname(""));
node_fs_1.default.writeFileSync(path_1.default.join(__dirname, `../${astConfig.output}`), base);
//# sourceMappingURL=AstCondeGen.js.map