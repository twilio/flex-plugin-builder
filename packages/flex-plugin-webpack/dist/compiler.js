"use strict";
/* c8 ignore start */
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
exports.compilerRenderer = void 0;
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var errors_1 = require("@twilio/flex-dev-utils/dist/errors");
var tapable_1 = require("tapable");
var fork_ts_checker_webpack_plugin_1 = __importDefault(require("fork-ts-checker-webpack-plugin"));
var typescript_compile_error_formatter_1 = __importDefault(require("@k88/typescript-compile-error-formatter"));
var webpack_1 = __importDefault(require("webpack"));
var fs_1 = require("@twilio/flex-dev-utils/dist/fs");
var format_webpack_messages_1 = __importDefault(require("@k88/format-webpack-messages"));
var urls_1 = require("@twilio/flex-dev-utils/dist/urls");
var prints_1 = require("./prints");
// Holds all compilation errors
var results = {};
/**
 * Creates a webpack compiler
 *
 * @param config      the Webpack configuration
 * @param devServer   whether to run the devserver or not
 * @param type        the webpack compile type
 * @param localPlugins  the names of plugins to run locally
 */
/* c8 ignore next */
exports.default = (function (config, devServer, isJavaScriptServer, onCompile) {
    flex_dev_utils_1.logger.debug('Creating webpack compiler');
    try {
        var compiler_1 = webpack_1.default(config);
        compiler_1.hooks.tsCompiled = new tapable_1.SyncHook(['warnings', 'errors']);
        // For build, we don't need to tap into any hooks
        if (!devServer) {
            return compiler_1;
        }
        var tsMessagesPromise_1;
        var tsMessagesResolver_1;
        if (fs_1.getPaths().app.isTSProject()) {
            compiler_1.hooks.beforeCompile.tap('beforeCompile', function () {
                tsMessagesPromise_1 = new Promise(function (resolve) {
                    tsMessagesResolver_1 = function (msgs) { return resolve(msgs); };
                });
            });
            fork_ts_checker_webpack_plugin_1.default.getCompilerHooks(compiler_1).receive.tap('afterTSCheck', function (diagnostics, lints) {
                var allMsgs = __spreadArray(__spreadArray([], __read(diagnostics)), __read(lints));
                var format = function (issue) { return issue.file + "\n" + typescript_compile_error_formatter_1.default(issue); };
                if (tsMessagesResolver_1) {
                    tsMessagesResolver_1({
                        errors: allMsgs.filter(function (msg) { return msg.severity === 'error'; }).map(format),
                        warnings: allMsgs.filter(function (msg) { return msg.severity === 'warning'; }).map(format),
                    });
                }
            });
        }
        // invalid is `bundle invalidated` and is invoked when files are modified in dev-server.
        compiler_1.hooks.invalid.tap('invalid', function () {
            flex_dev_utils_1.logger.clearTerminal();
            flex_dev_utils_1.logger.info("Re-compiling **" + fs_1.getPaths().app.name + "**");
        });
        compiler_1.hooks.done.tap('done', function (stats) { return __awaiter(void 0, void 0, void 0, function () {
            var result, delayedMsg, messages;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        result = stats.toJson({ all: false, errors: true, warnings: true });
                        if (!(fs_1.getPaths().app.isTSProject() && !stats.hasErrors())) return [3 /*break*/, 2];
                        delayedMsg = setTimeout(function () {
                            flex_dev_utils_1.logger.notice('Waiting for Typescript check results...');
                        }, 100);
                        return [4 /*yield*/, tsMessagesPromise_1];
                    case 1:
                        messages = _e.sent();
                        clearTimeout(delayedMsg);
                        // Push ts-compile errors into compiler
                        (_a = result.errors).push.apply(_a, __spreadArray([], __read(messages.errors)));
                        (_b = stats.compilation.errors).push.apply(_b, __spreadArray([], __read(messages.errors)));
                        (_c = result.warnings).push.apply(_c, __spreadArray([], __read(messages.warnings)));
                        (_d = stats.compilation.warnings).push.apply(_d, __spreadArray([], __read(messages.warnings)));
                        compiler_1.hooks.tsCompiled.call(messages.warnings, messages.errors);
                        _e.label = 2;
                    case 2:
                        setTimeout(function () {
                            var config = fs_1.readRunPluginsJson();
                            // Add the plugin to the loaded plugins configuration file
                            if (isJavaScriptServer) {
                                config.loadedPlugins.push(fs_1.getPaths().app.name);
                                fs_1.writeJSONFile(config, fs_1.getCliPaths().localPluginsJsonPath);
                            }
                            // Check to see if the plugin is the last bundle to be loaded
                            onCompile({
                                result: result,
                                appName: fs_1.getPaths().app.name,
                                lastPluginBundle: config.plugins.length === config.loadedPlugins.length,
                            });
                        }, Math.round(Math.random() * 1000));
                        return [2 /*return*/];
                }
            });
        }); });
        return compiler_1;
    }
    catch (err) {
        // @ts-ignore
        throw new errors_1.FlexPluginError("Failed to create a webpack compiler: " + err.message);
    }
});
/**
 * Prints the errors and warnings or a successful message when compilation finishes
 * @param port    the port the server is running on
 * @param localPlugins the local plugins running
 * @param showSuccessMsg    whether to show succecss message or not
 * @param hasRemote         whether there are any remote plugins
 */
var compilerRenderer = function (port, localPlugins, showSuccessMsg, hasRemote) {
    var _a = urls_1.getLocalAndNetworkUrls(port), local = _a.local, network = _a.network;
    var remotePlugins = [];
    var serverSuccessful = function (list) {
        list.forEach(function (l) {
            if (!remotePlugins.some(function (r) { return r.name === l.name; })) {
                remotePlugins.push(l);
            }
        });
        flex_dev_utils_1.logger.clearTerminal();
        prints_1.devServerSuccessful(local, network, localPlugins, remotePlugins, hasRemote);
    };
    return {
        onRemotePlugins: serverSuccessful,
        onCompile: function (_a) {
            var result = _a.result, appName = _a.appName;
            flex_dev_utils_1.logger.clearTerminal();
            results[appName] = result;
            var isSuccessful = Object.values(results).every(function (r) { return r.errors.length === 0 && r.warnings.length === 0; });
            if (isSuccessful) {
                if (showSuccessMsg) {
                    serverSuccessful([]);
                }
                return;
            }
            Object.keys(results).forEach(function (name) {
                var formatted = format_webpack_messages_1.default({
                    errors: results[name].errors,
                    warnings: results[name].warnings,
                });
                // Only show errors if both exist
                if (results[name].errors.length) {
                    /*
                     * Most errors are duplicate of the same error
                     * So only show the first error
                     */
                    formatted.errors.length = 1;
                    flex_dev_utils_1.logger.error("Failed to compile plugin " + flex_dev_utils_1.logger.colors.red.bold(name) + ".");
                    flex_dev_utils_1.logger.info(formatted.errors.join('\n'));
                    flex_dev_utils_1.logger.newline();
                    return;
                }
                if (results[name].warnings.length) {
                    flex_dev_utils_1.logger.warning("Compiled plugin " + flex_dev_utils_1.logger.colors.yellow.bold(name) + " with warning(s).");
                    flex_dev_utils_1.logger.info(formatted.warnings.join('\n'));
                    flex_dev_utils_1.logger.newline();
                }
            });
        },
    };
};
exports.compilerRenderer = compilerRenderer;
/* c8 ignore stop */
//# sourceMappingURL=compiler.js.map