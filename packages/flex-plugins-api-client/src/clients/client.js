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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var serviceHttpClient_1 = __importDefault(require("./serviceHttpClient"));
/**
 * An implementation of the raw {@link HttpClient} but made for PluginService
 */
var PluginServiceHttp = /** @class */ (function (_super) {
    __extends(PluginServiceHttp, _super);
    function PluginServiceHttp(username, password, options) {
        var _this = this;
        // eslint-disable-next-line  global-require, @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
        var pkg = require('../../package.json');
        var caller = (options && options.caller) || pkg.name;
        var packages = (options && options.packages) || {};
        packages[pkg.name] = pkg.version;
        _this = _super.call(this, __assign(__assign({}, options), { baseURL: "https://flex-api" + PluginServiceHttp.getRealm(options && options.realm) + ".twilio.com/" + PluginServiceHttp.version + "/PluginService", auth: { username: username, password: password }, caller: caller,
            packages: packages })) || this;
        return _this;
    }
    PluginServiceHttp.version = 'v1';
    return PluginServiceHttp;
}(serviceHttpClient_1.default));
exports.default = PluginServiceHttp;
//# sourceMappingURL=client.js.map