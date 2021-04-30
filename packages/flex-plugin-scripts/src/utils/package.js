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
exports.getPackageDetails = exports.LIST_OF_PACKAGES = exports.FLEX_PACKAGES = void 0;
var path_1 = require("path");
var fs_1 = require("flex-dev-utils/dist/fs");
exports.FLEX_PACKAGES = ['@twilio/flex-ui', 'flex-plugin-scripts', 'flex-plugin', 'flex-dev-utils'];
/* istanbul ignore next */
exports.LIST_OF_PACKAGES = __spreadArray(__spreadArray([], __read(exports.FLEX_PACKAGES)), ['react', 'react-dom', 'redux', 'react-redux']);
/**
 * @param packages
 */
/* istanbul ignore next */
var getPackageDetails = function (packages) {
    return packages.map(function (name) {
        var detail = {
            name: name,
            found: false,
            package: {},
        };
        try {
            var resolvedPath = fs_1.resolveModulePath(path_1.join(name, 'package.json'));
            if (resolvedPath) {
                // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
                detail.package = require(resolvedPath);
                detail.found = true;
            }
        }
        catch (e) {
            detail.found = false;
        }
        return detail;
    });
};
exports.getPackageDetails = getPackageDetails;
//# sourceMappingURL=package.js.map