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
/* eslint-disable */
var replace_in_file_1 = require("replace-in-file");
var core_1 = require("../core");
var utils_1 = require("../utils");
// Plugin start
var testSuite = function (_a) {
    var scenario = _a.scenario, config = _a.config, secrets = _a.secrets, environment = _a.environment;
    return __awaiter(void 0, void 0, void 0, function () {
        var plugin, ext, tmpComponentText, twilioCliResult, loginAndAssert, onError, onFinally;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    plugin = scenario.plugins[0];
                    utils_1.assertion.not.isNull(plugin);
                    ext = scenario.isTS ? 'tsx' : 'jsx';
                    tmpComponentText = 'hot reload works';
                    return [4 /*yield*/, utils_1.spawn('twilio', ['flex:plugins:start', '-l', 'debug'], {
                            detached: true,
                            cwd: plugin.dir,
                        })];
                case 1:
                    twilioCliResult = _b.sent();
                    return [4 /*yield*/, utils_1.pluginHelper.waitForPluginToStart(plugin.localhostUrl, core_1.testParams.config.start.timeout, core_1.testParams.config.start.pollInterval)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, utils_1.Browser.create({ flex: plugin.localhostUrl, twilioConsole: config.consoleBaseUrl })];
                case 3:
                    _b.sent();
                    loginAndAssert = function (firstLoad) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, utils_1.Browser.app.twilioConsole.login('agent-desktop', secrets.api.accountSid, config.localhostPort, firstLoad)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, utils_1.assertion.app.view.agentDesktop.isVisible()];
                                case 2:
                                    _a.sent();
                                    return [4 /*yield*/, utils_1.assertion.app.view.plugins.plugin.isVisible(plugin.componentText)];
                                case 3:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    onError = function (e) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, utils_1.Browser.app.takeScreenshot(environment.cwd, 'step006_failure.png')];
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
                                    return [4 /*yield*/, utils_1.killChildProcess(twilioCliResult.child, environment.operatingSystem)];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, utils_1.retryOnError(loginAndAssert, onError, onFinally, 3)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, replace_in_file_1.replaceInFile({
                            files: utils_1.joinPath(plugin.dir, 'src', 'components', 'CustomTaskList', "CustomTaskList." + ext),
                            from: tmpComponentText,
                            to: plugin.componentText,
                        })];
                case 5:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
testSuite.description = 'Running {{twilio flex:plugins:start}}';
exports.default = testSuite;
//# sourceMappingURL=step006.js.map