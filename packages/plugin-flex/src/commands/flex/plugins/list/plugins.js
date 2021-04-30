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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var general_1 = require("../../../../utils/general");
var information_flex_plugin_1 = __importDefault(require("../../../../sub-commands/information-flex-plugin"));
/**
 * Lists the Flex Plugins
 */
var FlexPluginsListPlugins = /** @class */ (function (_super) {
    __extends(FlexPluginsListPlugins, _super);
    function FlexPluginsListPlugins() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @override
     */
    FlexPluginsListPlugins.prototype.getResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pluginsApiToolkit.listPlugins({})];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.plugins];
                }
            });
        });
    };
    /**
     * @override
     */
    /* istanbul ignore next */
    FlexPluginsListPlugins.prototype.notFound = function () {
        this._logger.info("!!No plugins where not found.!!");
    };
    /**
     * @override
     */
    /* istanbul ignore next */
    FlexPluginsListPlugins.prototype.print = function (plugins) {
        var activePlugins = plugins.filter(function (p) { return p.isActive; });
        var inactivePlugins = plugins.filter(function (p) { return !p.isActive; });
        this.printHeader('Active Plugins');
        activePlugins.forEach(this._print.bind(this));
        this._logger.newline();
        this.printHeader('Inactive Plugins');
        inactivePlugins.forEach(this._print.bind(this));
    };
    /* istanbul ignore next */
    FlexPluginsListPlugins.prototype._print = function (plugin) {
        this.printVersion(plugin.name);
        this.printPretty(plugin, 'isActive', 'name');
        this._logger.newline();
    };
    FlexPluginsListPlugins.topicName = 'flex:plugins:list:plugins';
    FlexPluginsListPlugins.description = general_1.createDescription(FlexPluginsListPlugins.topic.description, false);
    FlexPluginsListPlugins.flags = __assign({}, information_flex_plugin_1.default.flags);
    return FlexPluginsListPlugins;
}(information_flex_plugin_1.default));
exports.default = FlexPluginsListPlugins;
//# sourceMappingURL=plugins.js.map