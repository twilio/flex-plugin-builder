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
Object.defineProperty(exports, "__esModule", { value: true });
var flex_dev_utils_1 = require("flex-dev-utils");
var prints_1 = require("flex-dev-utils/dist/prints");
/**
 * Instructions for removing node_modules and lock files and re-installing
 *
 * @param extras  any extra steps to include
 */
exports.default = (function () {
    var extras = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        extras[_i] = arguments[_i];
    }
    var nameColor = flex_dev_utils_1.logger.coloredStrings.name;
    var headline = flex_dev_utils_1.logger.coloredStrings.headline;
    flex_dev_utils_1.env.setQuiet(false);
    flex_dev_utils_1.logger.info("Please follow these steps to possibly " + headline('fix') + " this issue:");
    var lines = __spreadArray(__spreadArray([
        "Delete your " + nameColor('node_modules') + " directory",
        "Delete " + nameColor('package-lock.json') + " and/or " + nameColor('yarn.lock')
    ], __read(extras)), [
        "Run " + nameColor('npm install') + " or " + nameColor('yarn install') + " again",
    ]);
    prints_1.printList.apply(void 0, __spreadArray([], __read(lines)));
    flex_dev_utils_1.env.setQuiet(true);
});
//# sourceMappingURL=instructionToReinstall.js.map