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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var command_1 = require("@oclif/command");
var start_1 = require("flex-plugin-scripts/dist/scripts/start");
var pre_script_check_1 = require("flex-plugin-scripts/dist/scripts/pre-script-check");
var semver_1 = __importDefault(require("semver"));
var flex_dev_utils_1 = require("flex-dev-utils");
var fs_1 = require("flex-dev-utils/dist/fs");
var general_1 = require("../../../utils/general");
var flex_plugin_1 = __importDefault(require("../../../sub-commands/flex-plugin"));
var baseFlags = __assign({}, flex_plugin_1.default.flags);
// @ts-ignore
delete baseFlags.json;
var MULTI_PLUGINS_PILOT = pre_script_check_1.FLAG_MULTI_PLUGINS.substring(2);
/**
 * Starts the dev-server for building and iterating on a plugin bundle
 */
var FlexPluginsStart = /** @class */ (function (_super) {
    __extends(FlexPluginsStart, _super);
    function FlexPluginsStart(argv, config, secureStorage) {
        var _this = _super.call(this, argv, config, secureStorage, { strict: false }) || this;
        if (_this._flags['include-remote'] || _this._flags.name) {
            _this.opts.runInDirectory = false;
        }
        return _this;
    }
    /**
     * @override
     */
    FlexPluginsStart.prototype.doRun = function () {
        return __awaiter(this, void 0, void 0, function () {
            var flexArgs, pluginNames, _a, _b, name_1, flexStartScript, i, i, port;
            var e_1, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        flexArgs = [];
                        pluginNames = [];
                        if (this._flags.name) {
                            try {
                                for (_a = __values(this._flags.name), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    name_1 = _b.value;
                                    flexArgs.push('--name', name_1);
                                    if (!name_1.includes('@remote')) {
                                        pluginNames.push(name_1);
                                    }
                                }
                            }
                            catch (e_1_1) { e_1 = { error: e_1_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                }
                                finally { if (e_1) throw e_1.error; }
                            }
                        }
                        if (this._flags['include-remote']) {
                            flexArgs.push('--include-remote');
                        }
                        // If running in a plugin directory, append it to the names
                        if (this.isPluginFolder() && !flexArgs.includes(this.pkg.name)) {
                            flexArgs.push('--name', this.pkg.name);
                            pluginNames.push(this.pkg.name);
                        }
                        if (!pluginNames.length) {
                            throw new flex_dev_utils_1.TwilioCliError('You must run at least one local plugin. To view all remote plugins, go to flex.twilio.com.');
                        }
                        flexStartScript = { port: 3000 };
                        if (!(flexArgs.length && pluginNames.length)) return [3 /*break*/, 9];
                        i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(pluginNames && i < pluginNames.length)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.checkPlugin(pluginNames[i])];
                    case 2:
                        _d.sent();
                        _d.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, this.runScript('start', __spreadArray(['flex'], __read(flexArgs)))];
                    case 5:
                        // Start flex start once
                        flexStartScript = _d.sent();
                        i = 0;
                        _d.label = 6;
                    case 6:
                        if (!(pluginNames && i < pluginNames.length)) return [3 /*break*/, 9];
                        return [4 /*yield*/, start_1.findPortAvailablePort('--port', (flexStartScript.port + (i + 1) * 100).toString())];
                    case 7:
                        port = _d.sent();
                        // eslint-disable-next-line @typescript-eslint/no-floating-promises
                        this.spawnScript('start', ['plugin', '--name', pluginNames[i], '--port', port.toString()]);
                        _d.label = 8;
                    case 8:
                        i++;
                        return [3 /*break*/, 6];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Checks the plugin
     * @param pluginName  the plugin name
     */
    FlexPluginsStart.prototype.checkPlugin = function (pluginName) {
        return __awaiter(this, void 0, void 0, function () {
            var preScriptArgs, plugin, pkgDir, pkg, scriptVersion;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        preScriptArgs = ['--name', pluginName];
                        if (this.isMultiPlugin()) {
                            preScriptArgs.push("--" + MULTI_PLUGINS_PILOT);
                        }
                        return [4 /*yield*/, this.runScript('pre-script-check', preScriptArgs)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.runScript('pre-start-check', preScriptArgs)];
                    case 2:
                        _a.sent();
                        plugin = this.pluginsConfig.plugins.find(function (p) { return p.name === pluginName; });
                        if (!plugin) {
                            throw new flex_dev_utils_1.TwilioCliError("The plugin " + pluginName + " was not found.");
                        }
                        pkgDir = plugin.dir + "/package.json";
                        pkg = fs_1.readJsonFile(pkgDir);
                        scriptVersion = semver_1.default.coerce(pkg.dependencies['flex-plugin-scripts']);
                        if (!scriptVersion) {
                            scriptVersion = semver_1.default.coerce(pkg.devDependencies['flex-plugin-scripts']);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(FlexPluginsStart.prototype, "_flags", {
        /**
         * Parses the flags passed to this command
         */
        get: function () {
            return this.parse(FlexPluginsStart).flags;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FlexPluginsStart.prototype, "checkCompatibility", {
        /**
         * @override
         */
        get: function () {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns true if we are running multiple plugins
     * @private
     */
    FlexPluginsStart.prototype.isMultiPlugin = function () {
        if (this._flags['include-remote']) {
            return true;
        }
        var name = this._flags.name;
        if (!name) {
            return false;
        }
        if (name.length > 1) {
            return true;
        }
        if (this.isPluginFolder()) {
            return this.pkg.name !== name[0];
        }
        return false;
    };
    FlexPluginsStart.topicName = 'flex:plugins:start';
    FlexPluginsStart.description = general_1.createDescription(FlexPluginsStart.topic.description, false);
    FlexPluginsStart.flags = __assign(__assign({}, baseFlags), { name: command_1.flags.string({
            description: FlexPluginsStart.topic.flags.name,
            multiple: true,
        }), 'include-remote': command_1.flags.boolean({
            description: FlexPluginsStart.topic.flags.includeRemote,
        }) });
    return FlexPluginsStart;
}(flex_plugin_1.default));
exports.default = FlexPluginsStart;
//# sourceMappingURL=start.js.map