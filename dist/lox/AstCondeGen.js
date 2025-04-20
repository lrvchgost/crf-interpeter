"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const path_1 = __importDefault(require("path"));
const __dirname = path_1.default.resolve(path_1.default.dirname(''));
node_fs_1.default.writeFileSync(path_1.default.join(__dirname, 'Expr-text.ts'), 'export const a = 2;');
//# sourceMappingURL=AstCondeGen.js.map