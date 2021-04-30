"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printList = void 0;
var logger_1 = __importDefault(require("./logger"));
var strings_1 = require("./strings");
/**
 * Prints the lines in a numbered list:
 *  1. line 1
 *  2. line 2
 *  3. line 3
 *
 * @param lines the lines to print
 */
var printList = function () {
    var lines = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        lines[_i] = arguments[_i];
    }
    var digitColor = logger_1.default.coloredStrings.digit;
    lines = lines.map(function (line, index) { return "\t " + digitColor((index + 1).toString()) + ". " + line; });
    logger_1.default.newline();
    logger_1.default.info(strings_1.multilineString.apply(void 0, __spreadArray([], __read(lines))));
    logger_1.default.newline();
};
exports.printList = printList;
exports.default = {};
//# sourceMappingURL=prints.js.map