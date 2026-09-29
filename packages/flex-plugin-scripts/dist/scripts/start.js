"use strict";
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
exports.start = exports.findPortAvailablePort = exports._startDevServer = exports._getPluginsConfiguration = exports._onServerCrash = exports._requirePackages = void 0;
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var env_1 = require("@twilio/flex-dev-utils/dist/env");
var errors_1 = require("@twilio/flex-dev-utils/dist/errors");
var fs_1 = require("@twilio/flex-dev-utils/dist/fs");
var urls_1 = require("@twilio/flex-dev-utils/dist/urls");
var flex_plugin_webpack_1 = require("@twilio/flex-plugin-webpack");
var config_1 = __importStar(require("../config"));
var run_1 = __importDefault(require("../utils/run"));
var parser_1 = require("../utils/parser");
var prints_1 = require("../prints");
/**
 * requires packages
 *
 * @param pluginsPath   the plugins path
 * @param pkgPath       the package path
 * @private
 */
/* c8 ignore next */
var _requirePackages = function (pluginsPath, pkgPath) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, @typescript-eslint/no-require-imports
    var plugins = require(pluginsPath);
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, @typescript-eslint/no-require-imports
    var pkg = require(pkgPath);
    return {
        plugins: plugins,
        pkg: pkg,
    };
};
exports._requirePackages = _requirePackages;
/**
 * Handles server crash
 * @param payload
 */
var _onServerCrash = function (payload) {
    prints_1.serverCrashed(payload);
    flex_dev_utils_1.exit(1);
};
exports._onServerCrash = _onServerCrash;
/**
 * Parse the configuration
 * @param args
 * @returns
 */
var _getPluginsConfiguration = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return JSON.parse(args[args.indexOf('--plugin-config') + 1]);
};
exports._getPluginsConfiguration = _getPluginsConfiguration;
/**
 * Starts the webpack dev-server
 * @param port      the port the server is running on
 * @param plugins   the list of plugins user has requested
 * @param type      the webpack type
 * @param remoteAll whether to request all plugins
 * @private
 */
/* c8 ignore next */
var _startDevServer = function (plugins, options, pluginsConfig) { return __awaiter(void 0, void 0, void 0, function () {
    var type, port, remoteAll, isJavaScriptServer, isStaticServer, config, devConfig, localPlugins, pluginRequest, hasRemote, _a, onCompile, onRemotePlugins, pluginServerConfig, devCompiler, err_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                type = options.type, port = options.port, remoteAll = options.remoteAll;
                isJavaScriptServer = type === config_1.WebpackType.JavaScript;
                isStaticServer = type === config_1.WebpackType.Static;
                return [4 /*yield*/, config_1.default(config_1.ConfigurationType.Webpack, env_1.Environment.Development, true, type)];
            case 1:
                config = _c.sent();
                return [4 /*yield*/, config_1.default(config_1.ConfigurationType.DevServer, env_1.Environment.Development, true, type)];
            case 2:
                devConfig = _c.sent();
                localPlugins = plugins.filter(function (p) { return !p.remote; });
                pluginRequest = {
                    local: localPlugins.map(function (p) { return p.name; }),
                    remote: plugins
                        .filter(function (p) { return p.remote && !p.version && !localPlugins.some(function (l) { return l.name === p.name; }); })
                        .map(function (p) { return p.name; }),
                    versioned: plugins
                        .filter(function (p) { return p.remote && p.version && !localPlugins.some(function (l) { return l.name === p.name; }); })
                        .map(function (p) { return p.name + "@" + p.version; }),
                };
                hasRemote = pluginRequest.remote.length > 0 || pluginRequest.versioned.length > 0 || options.remoteAll;
                _a = flex_plugin_webpack_1.compilerRenderer(port, pluginRequest.local, !isJavaScriptServer, hasRemote), onCompile = _a.onCompile, onRemotePlugins = _a.onRemotePlugins;
                // Setup plugin's server
                if (!isJavaScriptServer) {
                    pluginServerConfig = { port: port, remoteAll: remoteAll };
                    flex_plugin_webpack_1.pluginServer(pluginRequest, devConfig, pluginServerConfig, onRemotePlugins, pluginsConfig);
                }
                // Start IPC Server
                if (isStaticServer) {
                    (_b = config === null || config === void 0 ? void 0 : config.plugins) === null || _b === void 0 ? void 0 : _b.push(new flex_plugin_webpack_1.DelayRenderStaticPlugin());
                    flex_plugin_webpack_1.startIPCServer();
                    // start-flex will be listening to compilation errors emitted by start-plugin
                    flex_plugin_webpack_1.onIPCServerMessage(flex_plugin_webpack_1.IPCType.onCompileComplete, onCompile);
                    flex_plugin_webpack_1.onIPCServerMessage(flex_plugin_webpack_1.IPCType.onDevServerCrashed, exports._onServerCrash);
                }
                // Start IPC Client
                if (isJavaScriptServer) {
                    flex_plugin_webpack_1.startIPCClient();
                }
                _c.label = 3;
            case 3:
                _c.trys.push([3, 4, , 6]);
                devCompiler = flex_plugin_webpack_1.compiler(config, true, isJavaScriptServer, isJavaScriptServer ? flex_plugin_webpack_1.emitCompileComplete : onCompile);
                flex_plugin_webpack_1.webpackDevServer(devCompiler, devConfig, type);
                return [3 /*break*/, 6];
            case 4:
                err_1 = _c.sent();
                return [4 /*yield*/, flex_plugin_webpack_1.emitDevServerCrashed(err_1)];
            case 5:
                _c.sent();
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/, {
                    port: port,
                }];
        }
    });
}); };
exports._startDevServer = _startDevServer;
/**
 * Finds the port
 * @param args
 */
var findPortAvailablePort = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var portIndex;
        return __generator(this, function (_a) {
            portIndex = args.indexOf('--port');
            return [2 /*return*/, portIndex === -1
                    ? urls_1.findPort(urls_1.getDefaultPort(process.env.PORT))
                    : Promise.resolve(urls_1.findPort(parseInt(args[portIndex + 1], 10)))];
        });
    });
};
exports.findPortAvailablePort = findPortAvailablePort;
/**
 * Starts the dev-server
 */
var start = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var port, userInputPlugins, plugin, type, options, pluginsConfig;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    flex_dev_utils_1.logger.debug('Starting local development environment');
                    fs_1.addCWDNodeModule.apply(void 0, __spreadArray([], __read(args)));
                    return [4 /*yield*/, exports.findPortAvailablePort.apply(void 0, __spreadArray([], __read(args)))];
                case 1:
                    port = _a.sent();
                    flex_dev_utils_1.env.setBabelEnv(env_1.Environment.Development);
                    flex_dev_utils_1.env.setNodeEnv(env_1.Environment.Development);
                    flex_dev_utils_1.env.setHost('0.0.0.0');
                    flex_dev_utils_1.env.setPort(port);
                    // Future  node version will silently consume unhandled exception
                    process.on('unhandledRejection', function (err) {
                        throw err;
                    });
                    userInputPlugins = parser_1.parseUserInputPlugins.apply(void 0, __spreadArray([true], __read(args)));
                    plugin = parser_1.findFirstLocalPlugin(userInputPlugins);
                    if (!plugin) {
                        throw new errors_1.FlexPluginError('You must run at least one plugin locally.');
                    }
                    type = config_1.WebpackType.Complete;
                    if (args[0] === 'flex') {
                        type = config_1.WebpackType.Static;
                        /*
                         * For some reason start flex sometimes throws this exception
                         * I haven't been able to figure why but it doesn't look like it is crashing the server
                         */
                        process.on('uncaughtException', function (err) {
                            // @ts-ignore
                            if (err.code === 'ECONNRESET') {
                                // do nothing
                                return;
                            }
                            throw err;
                        });
                    }
                    else if (args[0] === 'plugin') {
                        type = config_1.WebpackType.JavaScript;
                        flex_dev_utils_1.env.setWDSSocketPort(port);
                    }
                    fs_1.setCwd(plugin.dir);
                    options = {
                        port: port,
                        type: type,
                        remoteAll: args.includes('--include-remote'),
                    };
                    pluginsConfig = {};
                    if (type !== config_1.WebpackType.JavaScript) {
                        pluginsConfig = exports._getPluginsConfiguration.apply(void 0, __spreadArray([], __read(args)));
                    }
                    return [2 /*return*/, exports._startDevServer(userInputPlugins, options, pluginsConfig)];
            }
        });
    });
};
exports.start = start;
// eslint-disable-next-line @typescript-eslint/no-floating-promises
run_1.default(exports.start);
// eslint-disable-next-line import/no-unused-modules
exports.default = exports.start;
//# sourceMappingURL=start.js.map