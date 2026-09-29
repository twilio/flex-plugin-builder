"use strict";
/* eslint-disable import/no-unused-modules */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.boxen = exports.columnify = exports.printObjectArray = exports.printArray = exports.table = exports.singleLineString = exports.multilineString = exports.strings = exports.logger = exports.chalk = exports.coloredStrings = exports.Logger = void 0;
var _boxen = __importStar(require("./lib/boxen"));
var boxen = {
    error: _boxen.error,
    warning: _boxen.warning,
    info: _boxen.info,
    print: _boxen.print,
};
exports.boxen = boxen;
var logger_1 = require("./lib/logger");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return logger_1.Logger; } });
Object.defineProperty(exports, "coloredStrings", { enumerable: true, get: function () { return logger_1.coloredStrings; } });
var chalk_1 = require("chalk");
Object.defineProperty(exports, "chalk", { enumerable: true, get: function () { return __importDefault(chalk_1).default; } });
var logger_2 = require("./lib/logger");
Object.defineProperty(exports, "logger", { enumerable: true, get: function () { return __importDefault(logger_2).default; } });
var strings_1 = require("./lib/strings");
Object.defineProperty(exports, "strings", { enumerable: true, get: function () { return __importDefault(strings_1).default; } });
Object.defineProperty(exports, "multilineString", { enumerable: true, get: function () { return strings_1.multilineString; } });
Object.defineProperty(exports, "singleLineString", { enumerable: true, get: function () { return strings_1.singleLineString; } });
var table_1 = require("./lib/table");
Object.defineProperty(exports, "table", { enumerable: true, get: function () { return __importDefault(table_1).default; } });
Object.defineProperty(exports, "printArray", { enumerable: true, get: function () { return table_1.printArray; } });
Object.defineProperty(exports, "printObjectArray", { enumerable: true, get: function () { return table_1.printObjectArray; } });
var columnify_1 = require("./lib/columnify");
Object.defineProperty(exports, "columnify", { enumerable: true, get: function () { return __importDefault(columnify_1).default; } });
//# sourceMappingURL=index.js.map