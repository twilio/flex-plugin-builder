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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-unused-modules */
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var utils_1 = require("../utils");
var PLUGIN_RELEASED_TIMEOUT = 30000;
var PLUGIN_RELEASED_POLL_INTERVAL = 5000;
// Plugin visible on the Hosted Flex
var testSuite = function (_a) {
    var scenario = _a.scenario, config = _a.config, secrets = _a.secrets, environment = _a.environment;
    return __awaiter(void 0, void 0, void 0, function () {
        var plugin, release, plugins, releasedPlugin, accountSid, loginAndAssert, onError, onFinally;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    plugin = scenario.plugins[0];
                    utils_1.assertion.not.isNull(plugin);
                    if (!plugin.newlineValue) {
                        throw new Error("scenario.plugin.newlineValue does not have a valid value");
                    }
                    return [4 /*yield*/, utils_1.api.getActiveRelease()];
                case 1:
                    release = _b.sent();
                    if (!release) {
                        throw new Error('Account does not have an active release');
                    }
                    return [4 /*yield*/, utils_1.api.getActivePlugins(release.configuration_sid)];
                case 2:
                    plugins = _b.sent();
                    releasedPlugin = plugins.plugins.find(function (plgin) { return plgin.unique_name === plugin.name; });
                    if (!releasedPlugin) {
                        throw new Error("Did not find plugin with name: " + plugin.name + " in released plugins");
                    }
                    return [4 /*yield*/, utils_1.Browser.create({ flex: config.hostedFlexBaseUrl, twilioConsole: config.consoleBaseUrl })];
                case 3:
                    _b.sent();
                    // Log into Flex
                    return [4 /*yield*/, utils_1.Browser.app.twilioConsole.login('admin', secrets.api.accountSid, config.localhostPort)];
                case 4:
                    // Log into Flex
                    _b.sent();
                    return [4 /*yield*/, utils_1.assertion.app.view.adminDashboard.isVisible()];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, utils_1.Browser.app.getFlexAccountSid()];
                case 6:
                    accountSid = _b.sent();
                    utils_1.assertion.equal(accountSid, secrets.api.accountSid);
                    // Make sure that /plugins contain the plugin
                    return [4 /*yield*/, utils_1.pluginHelper.waitForPluginToRelease(releasedPlugin, PLUGIN_RELEASED_TIMEOUT, PLUGIN_RELEASED_POLL_INTERVAL)];
                case 7:
                    // Make sure that /plugins contain the plugin
                    _b.sent();
                    loginAndAssert = function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: 
                                // Load local plugin
                                return [4 /*yield*/, utils_1.Browser.app.agentDesktop.open()];
                                case 1:
                                    // Load local plugin
                                    _a.sent();
                                    flex_dev_utils_1.logger.info('Agent Desktop opened');
                                    // Check if the element is visible
                                    return [4 /*yield*/, utils_1.assertion.app.view.plugins.plugin.isVisible(plugin.newlineValue)];
                                case 2:
                                    // Check if the element is visible
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    onError = function (e) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, utils_1.Browser.app.takeScreenshot(environment.cwd, 'step010_failure.png')];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    onFinally = function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, utils_1.Browser.kill()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, utils_1.retryOnError(loginAndAssert, onError, onFinally, 3)];
                case 8:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
testSuite.description = 'Released Plugin visible on the Hosted Flex';
exports.default = testSuite;
//# sourceMappingURL=step010.js.map