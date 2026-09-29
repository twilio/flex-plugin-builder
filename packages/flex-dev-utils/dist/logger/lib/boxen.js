"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = exports.error = exports.info = exports.warning = exports.print = void 0;
var boxen_1 = __importDefault(require("boxen"));
var log_symbols_1 = __importDefault(require("log-symbols"));
var logger_1 = __importDefault(require("./logger"));
exports.default = boxen_1.default;
/**
 * Prints the message inside a box
 *
 * @param level   the log level to display the message as
 * @param msg     the message
 */
var print = function (level, msg) {
    var boxed = boxen_1.default(msg, {
        padding: 1,
        margin: 1,
    });
    logger_1.default[level](boxed);
};
exports.print = print;
/**
 * Displays the message as a warning box
 *
 * @param msg         the message to display
 * @param showSymbol  whether wrap the message in a warning symbol
 */
var warning = function (msg, showSymbol) {
    if (showSymbol === void 0) { showSymbol = true; }
    var sym = log_symbols_1.default.warning;
    if (showSymbol) {
        msg = sym + " " + msg + " " + sym;
    }
    exports.print('warning', msg);
};
exports.warning = warning;
/**
 * Displays the message as an info box
 *
 * @param msg         the message to display
 * @param showSymbol  whether wrap the message in an info symbol
 */
var info = function (msg, showSymbol) {
    if (showSymbol === void 0) { showSymbol = true; }
    var sym = log_symbols_1.default.info;
    if (showSymbol) {
        msg = sym + " " + msg + " " + sym;
    }
    exports.print('info', msg);
};
exports.info = info;
/**
 * Displays the message as am error box
 *
 * @param msg         the message to display
 * @param showSymbol  whether wrap the message in an error symbol
 */
var error = function (msg, showSymbol) {
    if (showSymbol === void 0) { showSymbol = true; }
    var sym = log_symbols_1.default.error;
    if (showSymbol) {
        msg = sym + " " + msg + " " + sym;
    }
    exports.print('error', msg);
};
exports.error = error;
/**
 * Displays the message as a success box
 *
 * @param msg         the message to display
 * @param showSymbol  whether wrap the message in a success symbol
 */
var success = function (msg, showSymbol) {
    if (showSymbol === void 0) { showSymbol = true; }
    var sym = log_symbols_1.default.success;
    if (showSymbol) {
        msg = sym + " " + msg + " " + sym;
    }
    exports.print('success', msg);
};
exports.success = success;
//# sourceMappingURL=boxen.js.map