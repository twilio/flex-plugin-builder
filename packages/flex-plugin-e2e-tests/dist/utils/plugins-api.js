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
Object.defineProperty(exports, "__esModule", { value: true });
var flex_plugins_api_client_1 = require("@twilio/flex-plugins-api-client");
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var core_1 = require("../core");
var serverlessApi = __importStar(require("./serverless-api"));
var options = {};
if (core_1.testParams.config.region) {
    // @ts-ignore
    options.region = core_1.testParams.config.region;
}
var client = new flex_plugins_api_client_1.PluginServiceHTTPClient(core_1.testParams.secrets.api.accountSid, core_1.testParams.secrets.api.authToken, options);
var pluginsClient = new flex_plugins_api_client_1.PluginsClient(client);
var versionsClient = new flex_plugins_api_client_1.PluginVersionsClient(client);
var configurationsClient = new flex_plugins_api_client_1.ConfigurationsClient(client);
var configuredPluginsClient = new flex_plugins_api_client_1.ConfiguredPluginsClient(client);
var releasesClient = new flex_plugins_api_client_1.ReleasesClient(client);
var cleanup = function () { return __awaiter(void 0, void 0, void 0, function () {
    var activeRelease, resource, list, _a, _b, plugin, e_1_1, service;
    var e_1, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                flex_dev_utils_1.logger.info('Cleaning up plugins-api');
                return [4 /*yield*/, releasesClient.active()];
            case 1:
                activeRelease = _d.sent();
                return [4 /*yield*/, configurationsClient.create({
                        Name: 'E2E Test Cleanup',
                        Description: 'Empty Configuration',
                        Plugins: [],
                    })];
            case 2:
                resource = _d.sent();
                return [4 /*yield*/, releasesClient.create({
                        ConfigurationId: resource.sid,
                    })];
            case 3:
                _d.sent();
                if (!activeRelease) return [3 /*break*/, 12];
                return [4 /*yield*/, configuredPluginsClient.list(activeRelease.configuration_sid)];
            case 4:
                list = _d.sent();
                _d.label = 5;
            case 5:
                _d.trys.push([5, 10, 11, 12]);
                _a = __values(list.plugins), _b = _a.next();
                _d.label = 6;
            case 6:
                if (!!_b.done) return [3 /*break*/, 9];
                plugin = _b.value;
                return [4 /*yield*/, versionsClient.archive(plugin.plugin_sid, plugin.plugin_version_sid)];
            case 7:
                _d.sent();
                _d.label = 8;
            case 8:
                _b = _a.next();
                return [3 /*break*/, 6];
            case 9: return [3 /*break*/, 12];
            case 10:
                e_1_1 = _d.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 12];
            case 11:
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
                return [7 /*endfinally*/];
            case 12: return [4 /*yield*/, serverlessApi.getServiceSid()];
            case 13:
                service = _d.sent();
                return [4 /*yield*/, serverlessApi.deleteEnvironments(service.sid)];
            case 14:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); };
var getPluginVersion = function (name, version) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, versionsClient.get(name, version)];
    });
}); };
var getLatestPluginVersion = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    var e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, versionsClient.latest(name)];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                e_2 = _a.sent();
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getPlugin = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, pluginsClient.get(name)];
    });
}); };
var getActiveRelease = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, releasesClient.active()];
    });
}); };
var getConfiguration = function (sid) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, configurationsClient.get(sid)];
    });
}); };
var getActivePlugins = function (sid) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, configuredPluginsClient.list(sid)];
    });
}); };
var cleanPluginVersions = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    var plugin, versions, _a, _b, version, e_3_1;
    var e_3, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, getPlugin(name)];
            case 1:
                plugin = _d.sent();
                flex_dev_utils_1.logger.info("Cleaning up plugin versions for " + name, plugin);
                return [4 /*yield*/, versionsClient.list(plugin.sid)];
            case 2:
                versions = _d.sent();
                _d.label = 3;
            case 3:
                _d.trys.push([3, 8, 9, 10]);
                _a = __values(versions.plugin_versions), _b = _a.next();
                _d.label = 4;
            case 4:
                if (!!_b.done) return [3 /*break*/, 7];
                version = _b.value;
                if (!!version.archived) return [3 /*break*/, 6];
                return [4 /*yield*/, versionsClient.archive(plugin.sid, version.sid)];
            case 5:
                _d.sent();
                _d.label = 6;
            case 6:
                _b = _a.next();
                return [3 /*break*/, 4];
            case 7: return [3 /*break*/, 10];
            case 8:
                e_3_1 = _d.sent();
                e_3 = { error: e_3_1 };
                return [3 /*break*/, 10];
            case 9:
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_3) throw e_3.error; }
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.default = {
    cleanup: cleanup,
    getPluginVersion: getPluginVersion,
    getLatestPluginVersion: getLatestPluginVersion,
    getPlugin: getPlugin,
    getActiveRelease: getActiveRelease,
    getConfiguration: getConfiguration,
    getActivePlugins: getActivePlugins,
    cleanPluginVersions: cleanPluginVersions,
};
//# sourceMappingURL=plugins-api.js.map