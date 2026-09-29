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
var TwilioError_1 = __importDefault(require("./TwilioError"));
/**
 *w
 * A Twilio REST API Error response
 * @link https://www.twilio.com/docs/usage/twilios-response#response-formats-exceptions
 */
var TwilioApiError = /** @class */ (function (_super) {
    __extends(TwilioApiError, _super);
    function TwilioApiError(code, message, status, moreInfo) {
        var _this = _super.call(this, message) || this;
        _this.code = code;
        _this.message = message;
        _this.moreInfo = moreInfo;
        _this.status = status;
        Object.setPrototypeOf(_this, TwilioApiError.prototype);
        return _this;
    }
    return TwilioApiError;
}(TwilioError_1.default));
exports.default = TwilioApiError;
//# sourceMappingURL=TwilioApiError.js.map