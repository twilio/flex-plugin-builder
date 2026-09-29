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
/* eslint-disable import/no-unused-modules, sonarjs/no-duplicate-string */
var replace_in_file_1 = require("replace-in-file");
var utils_1 = require("../utils");
// Create plugins
var testSuite = function (_a) {
    var scenario = _a.scenario, config = _a.config;
    return __awaiter(void 0, void 0, void 0, function () {
        var flags, ext, plugin1, plugin2, plugin3, setup, region, appConfig;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    flags = [];
                    if (scenario.isTS) {
                        flags.push('--typescript');
                    }
                    ext = scenario.isTS ? 'tsx' : 'jsx';
                    plugin1 = scenario.plugins[0];
                    plugin2 = scenario.plugins[1];
                    plugin3 = scenario.plugins[2];
                    setup = function (plugin, shouldReplace) {
                        if (shouldReplace === void 0) { shouldReplace = true; }
                        return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, utils_1.spawn('twilio', __spreadArray(['flex:plugins:create', plugin.name], __read(flags)))];
                                    case 1:
                                        _a.sent();
                                        utils_1.pluginHelper.changeFlexUIVersionIfRequired(scenario, plugin);
                                        return [4 /*yield*/, utils_1.spawn('npm', ['i'], { cwd: plugin.dir })];
                                    case 2:
                                        _a.sent();
                                        if (!shouldReplace) return [3 /*break*/, 4];
                                        return [4 /*yield*/, replace_in_file_1.replaceInFile({
                                                files: utils_1.joinPath(plugin.dir, 'src', 'components', 'CustomTaskList', "CustomTaskList." + ext),
                                                from: /This is a dismissible demo component.*/,
                                                to: plugin.componentText,
                                            })];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4: return [2 /*return*/];
                                }
                            });
                        });
                    };
                    utils_1.assertion.not.isNull(plugin1);
                    utils_1.assertion.not.isNull(plugin2);
                    utils_1.assertion.not.isNull(plugin3);
                    // Set 3 plugins
                    return [4 /*yield*/, setup(plugin1, false)];
                case 1:
                    // Set 3 plugins
                    _b.sent();
                    return [4 /*yield*/, setup(plugin2)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, setup(plugin3)];
                case 3:
                    _b.sent();
                    // Assert files/directories exist
                    utils_1.assertion.fileExists([plugin1.dir], 'Plugin directory does not exist');
                    utils_1.assertion.fileExists([plugin1.dir], 'Plugin directory does not exist');
                    utils_1.assertion.fileExists([plugin1.dir, 'src']);
                    utils_1.assertion.fileExists([plugin1.dir, 'src', 'components']);
                    utils_1.assertion.fileExists([plugin1.dir, 'src', 'components', '__tests__']);
                    utils_1.assertion.not.dirIsEmpty([plugin1.dir, 'src', 'components', '__tests__']);
                    utils_1.assertion.fileExists([plugin1.dir, 'public']);
                    utils_1.assertion.fileExists([plugin1.dir, 'package.json']);
                    utils_1.assertion.fileExists([plugin1.dir, 'webpack.config.js']);
                    utils_1.assertion.fileExists([plugin1.dir, 'webpack.dev.js']);
                    utils_1.assertion.fileExists([plugin1.dir, 'jest.config.js']);
                    utils_1.assertion.fileExists([plugin1.dir, 'public', 'appConfig.js']);
                    utils_1.assertion.fileExists([plugin1.dir, 'public', 'appConfig.example.js']);
                    // Assert package.json
                    utils_1.assertion.jsonFileContains([plugin1.dir, 'package.json'], "devDependencies['@twilio/flex-plugin-scripts']", scenario.packageVersion);
                    utils_1.assertion.jsonFileContains([plugin1.dir, 'package.json'], "dependencies['react']", "17.0.2");
                    utils_1.assertion.jsonFileContains([plugin1.dir, 'package.json'], "dependencies['react-dom']", "17.0.2");
                    utils_1.assertion.jsonFileContains([plugin1.dir, 'package.json'], "devDependencies['react-test-renderer']", "17.0.2");
                    region = config.region;
                    if (region) {
                        appConfig = {
                            pluginService: {
                                enabled: true,
                                url: '/plugins',
                            },
                            logLevel: 'info',
                            flexConfigServiceUrl: "https://flex-api." + region + ".twilio.com/v1/Configuration",
                            sdkOptions: {
                                chat: {
                                    region: 'stage-us1',
                                },
                                worker: {
                                    ebServer: "https://event-bridge." + region + "-us1.twilio.com/v1/wschannels",
                                    wsServer: "wss://event-bridge." + region + "-us1.twilio.com/v1/wschannels",
                                },
                                insights: {
                                    productId: 'flex_insights',
                                    region: region + "-us1",
                                },
                                voice: {
                                    chunderw: "chunderw-vpc-gll." + region + ".twilio.com",
                                    eventgw: "eventgw." + region + ".twilio.com",
                                },
                            },
                        };
                        utils_1.writeFileSync(utils_1.joinPath(plugin1.dir, 'public', 'appConfig.js'), "var appConfig = " + JSON.stringify(appConfig));
                    }
                    return [2 /*return*/];
            }
        });
    });
};
testSuite.description = 'Creating a Plugin';
exports.default = testSuite;
//# sourceMappingURL=step002.js.map