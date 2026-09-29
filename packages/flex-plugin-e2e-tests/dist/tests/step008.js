"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-unused-modules */
var replace_in_file_1 = require("replace-in-file");
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var utils_1 = require("../utils");
var step007_1 = require("./step007");
// Deploy plugin
var testSuite = function (_a) {
    var scenario = _a.scenario, config = _a.config;
    return __awaiter(void 0, void 0, void 0, function () {
        var plugin, ext, result, noWarnings, resource, apiPlugin, pluginVersion, latest;
        var _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: 
                // Starting deployment process with cleaning up the plugin versions to be used in further steps
                return [4 /*yield*/, Promise.all(scenario.plugins
                        .filter(function (plugin) { return plugin.name !== 'flex-e2e-tester-plugin-3'; })
                        .map(function (plugin) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, utils_1.api.cleanPluginVersions(plugin.name)];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
                case 1:
                    // Starting deployment process with cleaning up the plugin versions to be used in further steps
                    _f.sent();
                    plugin = scenario.plugins[0];
                    utils_1.assertion.not.isNull(plugin);
                    ext = scenario.isTS ? 'tsx' : 'jsx';
                    plugin.newlineValue = "This is a dismissible demo component " + Date.now();
                    plugin.changelog = "e2e test " + Date.now();
                    return [4 /*yield*/, replace_in_file_1.replaceInFile({
                            files: utils_1.joinPath(plugin.dir, 'src', 'components', 'CustomTaskList', "CustomTaskList." + ext),
                            from: /This is a dismissible demo component.*/,
                            to: plugin.newlineValue,
                        })];
                case 2:
                    _f.sent();
                    // Deploy with validation errors in the plugin with option fix
                    return [4 /*yield*/, replace_in_file_1.replaceInFile({
                            files: utils_1.joinPath(plugin.dir, 'src', 'components', 'CustomTaskList', "CustomTaskList." + ext),
                            from: step007_1.originalCode,
                            to: step007_1.codeWithViolation,
                        })];
                case 3:
                    // Deploy with validation errors in the plugin with option fix
                    _f.sent();
                    flex_dev_utils_1.logger.info('Running {{flex:plugins:deploy}} with --option {{fix}}');
                    return [4 /*yield*/, utils_1.spawn('twilio', __spreadArray([
                            'flex:plugins:deploy',
                            '--changelog',
                            "\"" + plugin.changelog + "\"",
                            '--patch',
                            '--option',
                            'fix',
                            '-l',
                            'debug'
                        ], __read(config.regionFlag)), {
                            cwd: plugin.dir,
                        })];
                case 4:
                    result = _f.sent();
                    noWarnings = ((_b = result.stdout.match(step007_1.WARNING_REGEX)) === null || _b === void 0 ? void 0 : _b.length) || 0;
                    // Should display violations
                    utils_1.assertion.equal(noWarnings, 2);
                    // Should not deploy the plugin
                    utils_1.assertion.not.stringContains(result.stdout, 'Next Steps');
                    utils_1.assertion.not.stringContains(result.stdout, 'twilio flex:plugins:release');
                    // Deploy with validation errors in the plugin with option deploy
                    flex_dev_utils_1.logger.info('Running {{flex:plugins:deploy}} with --option {{deploy}}');
                    return [4 /*yield*/, utils_1.spawn('twilio', __spreadArray([
                            'flex:plugins:deploy',
                            '--changelog',
                            "\"" + plugin.changelog + "\"",
                            '--patch',
                            '--option',
                            'deploy',
                            '-l',
                            'debug'
                        ], __read(config.regionFlag)), {
                            cwd: plugin.dir,
                        })];
                case 5:
                    result = _f.sent();
                    noWarnings = ((_c = result.stdout.match(step007_1.WARNING_REGEX)) === null || _c === void 0 ? void 0 : _c.length) || 0;
                    // Should display violations
                    utils_1.assertion.equal(noWarnings, 2);
                    // Should deploy the plugin
                    utils_1.assertion.stringContains(result.stdout, 'Next Steps');
                    utils_1.assertion.stringContains(result.stdout, 'twilio flex:plugins:release');
                    // Deploy the plugin bypassing validation issues found in the plugin
                    flex_dev_utils_1.logger.info('Running {{flex:plugins:deploy}} with --bypass-validation');
                    return [4 /*yield*/, utils_1.spawn('twilio', __spreadArray([
                            'flex:plugins:deploy',
                            '--changelog',
                            "\"" + plugin.changelog + "\"",
                            '--patch',
                            '--bypass-validation',
                            '-l',
                            'debug'
                        ], __read(config.regionFlag)), {
                            cwd: plugin.dir,
                        })];
                case 6:
                    result = _f.sent();
                    noWarnings = ((_d = result.stdout.match(step007_1.WARNING_REGEX)) === null || _d === void 0 ? void 0 : _d.length) || 0;
                    // Should display violations
                    utils_1.assertion.equal(noWarnings, 2);
                    // Should deploy the plugin
                    utils_1.assertion.stringContains(result.stdout, 'Next Steps');
                    utils_1.assertion.stringContains(result.stdout, 'twilio flex:plugins:release');
                    // Deploy without validation errors in the plugin
                    return [4 /*yield*/, replace_in_file_1.replaceInFile({
                            files: utils_1.joinPath(plugin.dir, 'src', 'components', 'CustomTaskList', "CustomTaskList." + ext),
                            from: step007_1.codeWithViolation,
                            to: step007_1.originalCode,
                        })];
                case 7:
                    // Deploy without validation errors in the plugin
                    _f.sent();
                    flex_dev_utils_1.logger.info('Running {{flex:plugins:deploy}} on a plugin with 0 valdiation issues');
                    return [4 /*yield*/, utils_1.spawn('twilio', __spreadArray(['flex:plugins:deploy', '--changelog', "\"" + plugin.changelog + "\"", '--patch', '-l', 'debug'], __read(config.regionFlag)), {
                            cwd: plugin.dir,
                        })];
                case 8:
                    result = _f.sent();
                    return [4 /*yield*/, utils_1.api.getLatestPluginVersion(plugin.name)];
                case 9:
                    resource = _f.sent();
                    plugin.version = (resource === null || resource === void 0 ? void 0 : resource.version) || '0.0.2'; // 0.0.2 is the default for first time plugin deployment in a Flex account
                    noWarnings = ((_e = result.stdout.match(step007_1.WARNING_REGEX)) === null || _e === void 0 ? void 0 : _e.length) || 0;
                    // Should display 0 violations
                    utils_1.assertion.equal(noWarnings, 0);
                    // Should deploy plugin
                    utils_1.assertion.fileExists([plugin.dir, 'build', plugin.name + ".js"]);
                    utils_1.assertion.fileContains([plugin.dir, 'build', plugin.name + ".js"], plugin.newlineValue);
                    utils_1.assertion.jsonFileContains([plugin.dir, 'package.json'], 'version', plugin.version);
                    utils_1.assertion.stringContains(result.stdout, 'Next Steps');
                    utils_1.assertion.stringContains(result.stdout, 'twilio flex:plugins:release');
                    utils_1.assertion.stringContains(result.stdout, plugin.name);
                    return [4 /*yield*/, utils_1.api.getPlugin(plugin.name)];
                case 10:
                    apiPlugin = _f.sent();
                    return [4 /*yield*/, utils_1.api.getPluginVersion(plugin.name, plugin.version)];
                case 11:
                    pluginVersion = _f.sent();
                    return [4 /*yield*/, utils_1.api.getLatestPluginVersion(plugin.name)];
                case 12:
                    latest = _f.sent();
                    utils_1.assertion.equal(apiPlugin.unique_name, plugin.name);
                    utils_1.assertion.equal(pluginVersion.version, plugin.version);
                    utils_1.assertion.equal(pluginVersion.changelog, plugin.changelog);
                    utils_1.assertion.equal(pluginVersion, latest);
                    return [2 /*return*/];
            }
        });
    });
};
testSuite.description = 'Running {{twilio flex:plugins:deploy}}';
exports.default = testSuite;
//# sourceMappingURL=step008.js.map