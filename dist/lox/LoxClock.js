"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoxClock = void 0;
const types_1 = require("./types");
class LoxClock extends types_1.LoxCallable {
    call() {
        return Date.now() / 1000;
    }
    arity() {
        return 0;
    }
    toString() {
        return "<native fn>";
    }
}
exports.LoxClock = LoxClock;
//# sourceMappingURL=LoxClock.js.map