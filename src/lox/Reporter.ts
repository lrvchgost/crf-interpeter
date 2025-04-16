export class Reporter {
  hadError = false;

  error(line: number, message: string) {
    this.report(line, "", message);
  }

  report(line: number, where: string, message: string) {
    console.log(`[line ${line}] Error ${where}: ${message}`);

    this.hadError =true;
  }

}
