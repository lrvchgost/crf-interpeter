import fs from "node:fs";
import path from "path";

const literal = "number | string | boolean | null";


const defineAst = (astConfig) => {
  const defineConstuctor = (params) => {
    let result = "";

    for (let p of params) {
      const [name, type] = p.split(":");
      const n = name.trim().endsWith('?') ? name.trim().slice(0, -1) : name.trim();
      result += `\n\t\tthis.${n} = ${n};`;
    }

    return result;
  };

  const defineType = (params) => {
    let result = "";

    for (let p of params) {
      const [name, type] = p.split(":");
      result += `\t${name.trim()}: ${type.trim()};\n`;
    }

    return result;
  };

  const defineClasses = (config) => {
    let cl = "";
    for (let c of config.classes) {
      const [name, params] = c.split("=");
      cl += `export class ${name.trim()} extends AST {
${defineType(params.split(","))}
\tconstructor(${params.trim()}) {
\t\tsuper();
${defineConstuctor(params.split(","))}
\t}

    visit<T>(visitor: Visitor<T>) {
        return visitor.visit${name.trim()}(this);
    }
}\n\n`;
    }

    return cl;
  };

  const defintVisitorMethods = (config) => {
    let result = "";

    for (let c of config.classes) {
      const name = c.split("=")[0].trim();

      result += `\tvisit${name}: (${name.toLowerCase()}Node: ${name}) => T;\n`;
    }

    return result;
  };

  const defineVisitorInterface = (astConfig) => {
    const type = `
export type Visitor<T> = {
${astConfig.map((config) => defintVisitorMethods(config)).join('')}
}`;

    return type;
  };

const generateTypes = (config) => {
  return `export type ${config.output} = ${config.classes
    .map((str) => str.split("=")[0].trim())
    .join(" | ")};
`
};

  const base = `import { Token } from './Token';

${defineVisitorInterface(astConfig)}

abstract class AST {
    abstract visit<T>(visitor: Visitor<T>): T
}

${astConfig.map((config) => generateTypes(config)).join('\n')}

${astConfig.map((config) => defineClasses(config)).join('\n')}`;

  const __dirname = path.resolve(path.dirname(""));

  fs.writeFileSync(path.join(__dirname, `../../Expr.ts`), base);
};

const exprConfig = {
  output: "Expr",
  classes: [
    "Assign   = name: Token, value: Expr",
    "Binary   = left: Expr, operator: Token, right: Expr",
    "Grouping = expression: Expr",
    `Literal  = value: ${literal}`,
    "Unary    = operator: Token, right: Expr",
    "Variable = name: Token",
    "Logical  = left: Expr, operator: Token, right: Expr",
    "Call     = calle: Expr, paren: Token, args: Expr[]"
  ],
};

const stmtConfig = {
  output: "Stmt",
  classes: [
    "Block      = statements: Stmt[]",
    "Expression = expression: Expr",
    "Print      = expression: Expr",
    "Return     = keyword: Token, value?: Expr",
    "Var        = name: Token, initializer?: Expr",
    "If         = condition: Expr, thenBranch: Stmt, elseBranch?: Stmt",
    "While      = condition: Expr, body: Stmt",
    "Function   = name: Token, params: Token[], body: Stmt[]",
  ],
};

defineAst([exprConfig, stmtConfig]);
