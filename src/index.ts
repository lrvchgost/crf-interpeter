import { Lox } from "./lox/Lox";

const args = process.argv.slice(2);

const sourceFolder = "source";

new Lox(args, sourceFolder);
