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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToMatchPath = void 0;
var AsymmetricMatcher_1 = require("./AsymmetricMatcher");
var utils = __importStar(require("../utils"));
var ToMatchPath = /** @class */ (function (_super) {
    __extends(ToMatchPath, _super);
    function ToMatchPath(actual, inverse) {
        if (inverse === void 0) { inverse = false; }
        var _this = _super.call(this, actual) || this;
        _this.inverse = inverse;
        return _this;
    }
    ToMatchPath.prototype.asymmetricMatch = function (expected) {
        return this.actual === utils.normalizePath(expected);
    };
    ToMatchPath.prototype.match = function (expected) {
        var pass = this.asymmetricMatch(expected);
        return {
            pass: pass,
            message: pass ? this.passMessage(this.actual, expected) : this.failMessage(this.actual, expected),
        };
    };
    ToMatchPath.prototype.method = function () {
        return 'toMatchPath';
    };
    ToMatchPath.prototype.toString = function () {
        return 'ToMatchPath';
    };
    return ToMatchPath;
}(AsymmetricMatcher_1.AsymmetricMatcher));
exports.ToMatchPath = ToMatchPath;
exports.default = (function (actual) { return new ToMatchPath(actual); });
//# sourceMappingURL=toMatchPath.js.map