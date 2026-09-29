"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsymmetricMatcher = void 0;
var jest_matcher_utils_1 = require("jest-matcher-utils");
/**
 * Abstract class for writing asymmetric matchers
 */
/* c8 ignore next */
var AsymmetricMatcher = /** @class */ (function () {
    function AsymmetricMatcher(actual) {
        var _this = this;
        this.passMessage = function (actual, expected) { return function () {
            return jest_matcher_utils_1.matcherHint(".not." + _this.method()) + "\n\nExpected value not to match:\n  " + jest_matcher_utils_1.printExpected(expected) + "\nReceived:\n  " + jest_matcher_utils_1.printReceived(actual);
        }; };
        this.failMessage = function (actual, expected) { return function () {
            return jest_matcher_utils_1.matcherHint("." + _this.method()) + "\n\nExpected value to match:\n  " + jest_matcher_utils_1.printExpected(expected) + "\nReceived:\n  " + jest_matcher_utils_1.printReceived(actual);
        }; };
        this.$$typeof = Symbol.for('jest.asymmetricMatcher');
        this.actual = actual;
    }
    AsymmetricMatcher.prototype.toAsymmetricMatcher = function () {
        return this.toString() + "<" + this.actual + ">";
    };
    return AsymmetricMatcher;
}());
exports.AsymmetricMatcher = AsymmetricMatcher;
//# sourceMappingURL=AsymmetricMatcher.js.map