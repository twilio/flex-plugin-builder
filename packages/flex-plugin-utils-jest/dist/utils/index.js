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
exports.normalizePath = exports.isWin = void 0;
var path_1 = __importDefault(require("path"));
var os_1 = __importDefault(require("os"));
/**
 * Returns if platform is windows
 */
var isWin = function () { return os_1.default.platform() === 'win32'; };
exports.isWin = isWin;
/**
 * Normalizes the path
 * @param parts
 */
var normalizePath = function () {
    var parts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        parts[_i] = arguments[_i];
    }
    var normalized = path_1.default.normalize(path_1.default.join.apply(path_1.default, __spreadArray([], __read(parts))));
    if (exports.isWin() && parts[0].charAt(0) === '/') {
        normalized = "C:" + normalized;
    }
    return normalized;
};
exports.normalizePath = normalizePath;
//# sourceMappingURL=index.js.map