"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reporter = void 0;
class Reporter {
    hadError = false;
    error(line, message) {
        this.report(line, "", message);
    }
    report(line, where, message) {
        console.log(`[line ${line}] Error ${where}: ${message}`);
        this.hadError = true;
    }
}
exports.Reporter = Reporter;
//# sourceMappingURL=Reporter.js.map