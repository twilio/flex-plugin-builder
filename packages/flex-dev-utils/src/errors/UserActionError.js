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
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var UserActionError = /** @class */ (function (_super) {
    __extends(UserActionError, _super);
    function UserActionError(reason, message) {
        var _this = 
        /* istanbul ignore next */
        _super.call(this, message || reason) || this;
        _this.reason = reason;
        Object.setPrototypeOf(_this, UserActionError.prototype);
        return _this;
    }
    return UserActionError;
}(_1.FlexPluginError));
exports.default = UserActionError;
//# sourceMappingURL=UserActionError.js.map