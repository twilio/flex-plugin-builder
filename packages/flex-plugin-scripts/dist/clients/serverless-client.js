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
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
/**
 * An implementation of the raw {@link HttpClient} but made for Serverless services
 */
var ServerlessClient = /** @class */ (function (_super) {
    __extends(ServerlessClient, _super);
    function ServerlessClient(username, password, options) {
        return _super.call(this, __assign(__assign({}, options), { baseURL: "https://serverless.twilio.com/" + ServerlessClient.version, auth: { username: username, password: password }, supportProxy: true })) || this;
    }
    ServerlessClient.version = 'v1';
    return ServerlessClient;
}(flex_dev_utils_1.HttpClient));
exports.default = ServerlessClient;
//# sourceMappingURL=serverless-client.js.map