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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var fs_1 = require("@twilio/flex-dev-utils/dist/fs");
var browser_1 = require("./browser");
var timers_1 = require("./timers");
var _1 = require(".");
/**
 * Waits for plugin to start at the given url
 * @param url plugin url to poll for a successful response
 * @param timeout maximum amount of time to wait until failing
 * @param pollInterval time to wait between each polling attempt
 */
var waitForPluginToStart = function (url, timeout, pollInterval) { return __awaiter(void 0, void 0, void 0, function () {
    var counter, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                counter = 0;
                _a.label = 1;
            case 1:
                if (!true) return [3 /*break*/, 7];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, axios_1.default.get(url)];
            case 3:
                _a.sent();
                return [3 /*break*/, 7];
            case 4:
                e_1 = _a.sent();
                if (counter === timeout) {
                    flex_dev_utils_1.logger.error(e_1);
                    throw new Error('Plugin did not start');
                }
                return [3 /*break*/, 5];
            case 5: return [4 /*yield*/, timers_1.sleep(pollInterval)];
            case 6:
                _a.sent();
                counter += pollInterval;
                return [3 /*break*/, 1];
            case 7: return [2 /*return*/];
        }
    });
}); };
/**
 * Waits for /plugins to contain the released plugin
 * @param flexBaseUrl Flex base URL
 * @param releasedPlugin plugin which was released
 * @param timeout maximum amount of time to wait until failing
 * @param pollInterval time to wait between each polling attempt
 */
var waitForPluginToRelease = function (releasedPlugin, timeout, pollInterval) { return __awaiter(void 0, void 0, void 0, function () {
    var counter, plugins, plugin, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                counter = 0;
                _a.label = 1;
            case 1:
                if (!true) return [3 /*break*/, 7];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, browser_1.Browser.app.plugins.list()];
            case 3:
                plugins = _a.sent();
                plugin = plugins.find(function (plugin) { return plugin.name === releasedPlugin.unique_name; });
                if (!plugin) {
                    throw new Error("/plugins did not contain " + releasedPlugin.unique_name);
                }
                flex_dev_utils_1.logger.info('/plugins endpoint returned', JSON.stringify(plugins));
                return [3 /*break*/, 7];
            case 4:
                e_2 = _a.sent();
                if (counter >= timeout) {
                    throw e_2;
                }
                return [3 /*break*/, 5];
            case 5: return [4 /*yield*/, timers_1.sleep(pollInterval)];
            case 6:
                _a.sent();
                counter += pollInterval;
                return [3 /*break*/, 1];
            case 7: return [2 /*return*/];
        }
    });
}); };
/**
 * Changes the @twilio/flex-ui version in package.json if required
 * @param scenario
 * @param plugin
 */
var changeFlexUIVersionIfRequired = function (scenario, plugin) {
    if (scenario.flexUIVersion) {
        var pkgPath = _1.joinPath(plugin.dir, 'package.json');
        var pkg = fs_1.readPackageJson(pkgPath);
        pkg.devDependencies['@twilio/flex-ui'] = scenario.flexUIVersion;
        fs_1.writeJSONFile(pkg, pkgPath);
    }
};
exports.default = {
    waitForPluginToStart: waitForPluginToStart,
    waitForPluginToRelease: waitForPluginToRelease,
    changeFlexUIVersionIfRequired: changeFlexUIVersionIfRequired,
};
//# sourceMappingURL=plugin-helper.js.map