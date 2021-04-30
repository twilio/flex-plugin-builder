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
exports.FlexPluginsAPIToolkitBase = void 0;
var flex_plugins_api_client_1 = require("flex-plugins-api-client");
var flexPluginsAPIToolkitBase_1 = __importDefault(require("./flexPluginsAPIToolkitBase"));
var flexPluginsAPIToolkitBase_2 = require("./flexPluginsAPIToolkitBase");
Object.defineProperty(exports, "FlexPluginsAPIToolkitBase", { enumerable: true, get: function () { return __importDefault(flexPluginsAPIToolkitBase_2).default; } });
var FlexPluginsAPIToolkit = /** @class */ (function (_super) {
    __extends(FlexPluginsAPIToolkit, _super);
    function FlexPluginsAPIToolkit(username, password, options) {
        var _this = this;
        var httpClient = new flex_plugins_api_client_1.PluginServiceHTTPClient(username, password, options);
        _this = _super.call(this, httpClient) || this;
        return _this;
    }
    return FlexPluginsAPIToolkit;
}(flexPluginsAPIToolkitBase_1.default));
exports.default = FlexPluginsAPIToolkit;
//# sourceMappingURL=index.js.map