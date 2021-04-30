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
var TwilioCliError_1 = __importDefault(require("./TwilioCliError"));
var NotImplementedError = /** @class */ (function (_super) {
    __extends(NotImplementedError, _super);
    function NotImplementedError() {
        var _this = _super.call(this, 'Abstract method must be implemented') || this;
        Object.setPrototypeOf(_this, NotImplementedError.prototype);
        return _this;
    }
    return NotImplementedError;
}(TwilioCliError_1.default));
exports.default = NotImplementedError;
//# sourceMappingURL=NotImplementedError.js.map