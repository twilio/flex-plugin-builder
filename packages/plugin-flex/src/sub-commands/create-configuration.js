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
var flex_dev_utils_1 = require("flex-dev-utils");
var flags = __importStar(require("../utils/flags"));
var general_1 = require("../utils/general");
var flex_plugin_1 = __importDefault(require("./flex-plugin"));
var baseFlags = __assign({}, flex_plugin_1.default.flags);
// @ts-ignore
delete baseFlags.json;
/**
 * Creates a Configuration
 */
var CreateConfiguration = /** @class */ (function (_super) {
    __extends(CreateConfiguration, _super);
    function CreateConfiguration() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Performs the actual task of validating and creating configuration. This method is also usd by release script.
     */
    CreateConfiguration.prototype.doCreateConfiguration = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, flex_dev_utils_1.progress("Creating configuration", function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        return [2 /*return*/, this.createConfiguration()];
                    }); }); }, false)];
            });
        });
    };
    /**
     * Registers a configuration with Plugins API
     * @returns {Promise}
     */
    CreateConfiguration.prototype.createConfiguration = function () {
        return __awaiter(this, void 0, void 0, function () {
            var option;
            return __generator(this, function (_a) {
                option = {
                    name: this._flags.name,
                    addPlugins: [],
                    removePlugins: [],
                    description: this._flags.description || '',
                };
                if (!this._flags.new) {
                    option.fromConfiguration = 'active';
                }
                if (this._flags['enable-plugin']) {
                    option.addPlugins = this._flags['enable-plugin'];
                }
                if (this._flags['disable-plugin']) {
                    option.removePlugins = this._flags['disable-plugin'];
                }
                return [2 /*return*/, this.pluginsApiToolkit.createConfiguration(option)];
            });
        });
    };
    Object.defineProperty(CreateConfiguration.prototype, "_flags", {
        get: function () {
            return this.parse(CreateConfiguration).flags;
        },
        enumerable: false,
        configurable: true
    });
    CreateConfiguration.topicName = 'flex:plugins:create-configuration';
    CreateConfiguration.description = general_1.createDescription(CreateConfiguration.topic.description, true);
    CreateConfiguration.nameFlag = {
        description: CreateConfiguration.topic.flags.name,
        default: "Autogenerated Release " + Date.now(),
        required: true,
        max: 100,
    };
    CreateConfiguration.enablePluginFlag = {
        description: CreateConfiguration.topic.flags.enablePlugin,
        multiple: true,
        required: false,
        alias: 'plugin',
    };
    CreateConfiguration.disablePluginFlag = {
        description: CreateConfiguration.topic.flags.disablePlugin,
        multiple: true,
        required: false,
    };
    CreateConfiguration.descriptionFlag = {
        description: CreateConfiguration.topic.flags.description,
        default: CreateConfiguration.topic.defaults.description,
        required: true,
        max: 500,
    };
    CreateConfiguration.aliasEnablePluginFlag = __assign(__assign({}, CreateConfiguration.enablePluginFlag), { alias: undefined, description: CreateConfiguration.topic.flags.plugin });
    CreateConfiguration.flags = __assign(__assign({}, baseFlags), { new: flags.boolean({
            description: CreateConfiguration.topic.flags.new,
        }), name: flags.string(CreateConfiguration.nameFlag), plugin: flags.string(CreateConfiguration.aliasEnablePluginFlag), 'enable-plugin': flags.string(CreateConfiguration.enablePluginFlag), 'disable-plugin': flags.string(CreateConfiguration.disablePluginFlag), description: flags.string(CreateConfiguration.descriptionFlag) });
    return CreateConfiguration;
}(flex_plugin_1.default));
exports.default = CreateConfiguration;
//# sourceMappingURL=create-configuration.js.map