"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleLineString = exports.multilineString = void 0;
/**
 * Converts an array of arguments into a multiline string
 *
 * @param args  the lines to print
 */
var multilineString = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.join('\r\n');
};
exports.multilineString = multilineString;
/**
 * Converts an array of string into a single lin
 * @param args  the lines to print
 */
var singleLineString = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.map(function (arg, index) { return (index === 0 ? arg.trim() : " " + arg.trim()); }).join('');
};
exports.singleLineString = singleLineString;
exports.default = {
    multilineString: exports.multilineString,
    singleLineString: exports.singleLineString,
};
//# sourceMappingURL=strings.js.map