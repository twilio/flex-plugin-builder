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
var flex_plugins_api_client_1 = require("flex-plugins-api-client");
var client = new flex_plugins_api_client_1.PluginServiceHTTPClient(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
var pluginsClient = new flex_plugins_api_client_1.PluginsClient(client);
var versionsClient = new flex_plugins_api_client_1.PluginVersionsClient(client);
var configurationsClient = new flex_plugins_api_client_1.ConfigurationsClient(client);
var configuredPluginsClient = new flex_plugins_api_client_1.ConfiguredPluginsClient(client);
var releasesClient = new flex_plugins_api_client_1.ReleasesClient(client);
var cleanup = function () { return __awaiter(void 0, void 0, void 0, function () {
    var resource;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, configurationsClient.create({
                    Name: 'E2E Test Cleanup',
                    Description: 'Empty Configuration',
                    Plugins: [],
                })];
            case 1:
                resource = _a.sent();
                return [4 /*yield*/, releasesClient.create({
                        ConfigurationId: resource.sid,
                    })];
            case 2:
                _a.sent();
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
    return __generator(this, function (_a) {
        try {
            return [2 /*return*/, versionsClient.latest(name)];
        }
        catch (e) {
            return [2 /*return*/, null];
        }
        return [2 /*return*/];
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
exports.default = {
    cleanup: cleanup,
    getPluginVersion: getPluginVersion,
    getLatestPluginVersion: getLatestPluginVersion,
    getPlugin: getPlugin,
    getActiveRelease: getActiveRelease,
    getConfiguration: getConfiguration,
    getActivePlugins: getActivePlugins,
};
//# sourceMappingURL=api.js.map