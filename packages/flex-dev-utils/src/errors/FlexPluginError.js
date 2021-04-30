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
var flex_plugins_utils_exception_1 = require("flex-plugins-utils-exception");
var fs_1 = require("../fs");
var logger_1 = __importDefault(require("../logger"));
var FlexPluginError = /** @class */ (function (_super) {
    __extends(FlexPluginError, _super);
    function FlexPluginError(msg) {
        var _this = 
        /* istanbul ignore next */
        _super.call(this, msg) || this;
        _this.print = function () {
            logger_1.default.error(_this.message);
        };
        _this.details = function () {
            var headline = logger_1.default.coloredStrings.headline;
            if (_this.pkg) {
                var deps_1 = _this.pkg.dependencies;
                var names = ['flex-plugin', 'flex-plugin-scripts'];
                logger_1.default.newline();
                logger_1.default.info("Your plugin " + _this.pkg.name + " is using the following versions:");
                logger_1.default.newline();
                names.forEach(function (name) { return logger_1.default.info("\t " + headline("\"" + name + "\": \"" + deps_1[name] + "\"")); });
                logger_1.default.newline();
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