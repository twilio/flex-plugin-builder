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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var flex_plugins_utils_exception_1 = require("@twilio/flex-plugins-utils-exception");
var fs_1 = require("../../fs");
var logger_1 = require("../../logger");
var FlexPluginError = /** @class */ (function (_super) {
    __extends(FlexPluginError, _super);
    function FlexPluginError(msg) {
        var _this = 
        /* c8 ignore next */
        _super.call(this, msg) || this;
        _this.print = function () {
            logger_1.logger.error(_this.message);
        };
        _this.details = function () {
            var headline = logger_1.logger.coloredStrings.headline;
            if (_this.pkg) {
                var allDeps_1 = __assign(__assign({}, _this.pkg.dependencies), _this.pkg.devDependencies);
                var names = ['@twilio/flex-plugin', '@twilio/flex-plugin-scripts'];
                logger_1.logger.newline();
                logger_1.logger.info("Your plugin " + _this.pkg.name + " is using the following versions:");
                logger_1.logger.newline();
                names.forEach(function (name) { return logger_1.logger.info("\t " + headline("\"" + name + "\": \"" + allDeps_1[name] + "\"")); });
                logger_1.logger.newline();
            }
        };
        try {
            _this.pkg = fs_1.readAppPackageJson();
        }
        catch (e) {
            _this.pkg = null;
        }
        Object.setPrototypeOf(_this, FlexPluginError.prototype);
        return _this;
    }
    return FlexPluginError;
}(flex_plugins_utils_exception_1.TwilioError));
exports.default = FlexPluginError;
//# sourceMappingURL=FlexPluginError.js.map