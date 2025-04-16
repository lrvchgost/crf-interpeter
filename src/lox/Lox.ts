import path from "node:path";
import fs from "node:fs";
import readline from "readline";
import { Scanner } from "../Scanner";
import {Reporter} from "./Reporter";

export class Lox extends Reporter {
  hadError = false;

  constructor(args: string[], private sourceFolder: string) {
    super();

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
    const filePath = path.join(__dirname, "../../", this.sourceFolder, sourcePath);

    if (!fs.existsSync(filePath)) {
      throw `File not found ${filePath}`;
    }

    try {
      const text = fs.readFileSync(filePath, "utf8").trim();

      this.run(text);

      if (this.hadError) {
        process.exit(65);
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
    this.hadError = false;
    // rl.close();
  }

  run(source: string) {
    const scanner = new Scanner(source);
    const tokens = scanner.scanTokens();

    console.log(tokens.length);

    for (let token of tokens) {
      console.log(token);
    }
  }
}
