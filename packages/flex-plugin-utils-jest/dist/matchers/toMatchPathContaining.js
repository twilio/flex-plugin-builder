"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToMatchPathContaining = void 0;
var path_1 = __importDefault(require("path"));
var AsymmetricMatcher_1 = require("./AsymmetricMatcher");
var ToMatchPathContaining = /** @class */ (function (_super) {
    __extends(ToMatchPathContaining, _super);
    function ToMatchPathContaining(actual, inverse) {
        if (inverse === void 0) { inverse = false; }
        var _this = _super.call(this, actual) || this;
        _this.inverse = inverse;
        return _this;
    }
    ToMatchPathContaining.prototype.asymmetricMatch = function (expected) {
        return this.actual.includes(path_1.default.normalize(expected));
    };
    ToMatchPathContaining.prototype.match = function (expected) {
        var pass = this.asymmetricMatch(expected);
        return {
            pass: pass,
            message: pass ? this.passMessage(this.actual, expected) : this.failMessage(this.actual, expected),
        };
    };
    ToMatchPathContaining.prototype.method = function () {
        return 'toMatchPathContaining';
    };
    ToMatchPathContaining.prototype.toString = function () {
        return 'ToMatchPathContaining';
    };
    return ToMatchPathContaining;
}(AsymmetricMatcher_1.AsymmetricMatcher));
exports.ToMatchPathContaining = ToMatchPathContaining;
exports.default = (function (actual) { return new ToMatchPathContaining(actual); });
//# sourceMappingURL=toMatchPathContaining.js.map