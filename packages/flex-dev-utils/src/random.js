"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomString = exports._randomGenerator = void 0;
/**
 * Generates a random string
 *
 * @param n the length of the string
 * @private
 */
var _randomGenerator = function (n) { return Math.random().toString(26).slice(2).substring(0, n); };
exports._randomGenerator = _randomGenerator;
/**
 * Generates a random string; if a list is provided, ensures the string is not in the list
 *
 * @param length    the length
 * @param list      the list to ensure the new string is unique
 */
var randomString = function (length, list) {
    if (list === void 0) { list = []; }
    var str = exports._randomGenerator(length);
    while (list.includes(str)) {
        str = exports._randomGenerator(length);
    }
    return str;
};
exports.randomString = randomString;
exports.default = exports.randomString;
//# sourceMappingURL=random.js.map