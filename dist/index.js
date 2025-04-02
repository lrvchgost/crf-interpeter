"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lox_1 = require("./lox/Lox");
const args = process.argv.slice(2);
const sourceFolder = "source";
new Lox_1.Lox(args, sourceFolder);
//# sourceMappingURL=index.js.map