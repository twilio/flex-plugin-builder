"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.printObjectArray = exports.printArray = exports.isRegularMatrix = void 0;
var table_1 = require("table");
var logger_1 = __importDefault(require("./logger"));
var config = {
    border: {
        topBody: '─',
        topJoin: '┬',
        topLeft: '┌',
        topRight: '┐',
        bottomBody: '─',
        bottomJoin: '┴',
        bottomLeft: '└',
        bottomRight: '┘',
        bodyLeft: '│',
        bodyRight: '│',
        bodyJoin: '│',
        joinBody: '─',
        joinLeft: '├',
        joinRight: '┤',
        joinJoin: '┼',
    },
};
/**
 * Checks that the matrix's rows all have the same number of entries
 *
 * @param matrix
 */
var isRegularMatrix = function (matrix) {
    return matrix && matrix.length > 0 && matrix[0].constructor === Array && matrix.every(function (r) { return r.length === matrix[0].length; });
};
exports.isRegularMatrix = isRegularMatrix;
/**
 * Prints the data in a table format with the provided headers
 *
 * @param header  the header of the table
 * @param data    the data entry to print
 */
var printArray = function (header, data) {
    if (!exports.isRegularMatrix(data)) {
        logger_1.default.warning('Table rows are not all the same length; this may produce an irregular tabular view.');
    }
    if (header.length === Object.keys(data[0]).length) {
        data.unshift(header.map(function (h) { return h.toUpperCase(); }));
    }
    else {
        logger_1.default.warning('Header length does not match data row length; printing table without header.');
    }
    logger_1.default.info(table_1.table(data, config));
};
exports.printArray = printArray;
/**
 * Prints the data in a table format with the provided headers.
 *
 * @param data    the data entry to print
 */
// eslint-disable-next-line @typescript-eslint/ban-types
var printObjectArray = function (data) {
    if (data.length !== 0) {
        var header = Object.keys(data[0]);
        var rows = data.map(Object.values);
        exports.printArray(header, rows);
    }
};
exports.printObjectArray = printObjectArray;
exports.default = {
    isRegularMatrix: exports.isRegularMatrix,
    printArray: exports.printArray,
    printObjectArray: exports.printObjectArray,
};
//# sourceMappingURL=table.js.map