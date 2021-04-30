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
var url_join_1 = __importDefault(require("url-join"));
var RESPONSE_KEY = 'plugin_versions';
/**
 * Plugin Public API Http client for the PluginVersion resource
 * @link https://www.twilio.com/docs/flex/plugins/api/plugin-version
 */
var PluginVersionsClient = /** @class */ (function () {
    function PluginVersionsClient(client) {
        this.client = client;
    }
    /**
     * Helper method to generate the URI for PluginVersion
     * @param pluginId    the plugin identifier
     * @param versionId   the plugin version identifier
     */
    PluginVersionsClient.getUrl = function (pluginId, versionId) {
        var url = "Plugins/" + pluginId + "/Versions";
        if (versionId) {
            return url + "/" + versionId;
        }
        return url;
    };
    /**
     * Fetches the list of {@link PluginVersionResourcePage}
     * @param pluginId the plugin identifier
     * @param pagination the pagination meta data
     */
    PluginVersionsClient.prototype.list = function (pluginId, pagination) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.list(PluginVersionsClient.getUrl(pluginId), RESPONSE_KEY, pagination)];
            });
        });
    };
    /**
     * Fetches the latest {@link PluginVersionResourcePage} by calling the List endpoint and returns the first entry.
     * @param pluginId the plugin identifier
     */
    PluginVersionsClient.prototype.latest = function (pluginId) {
        return __awaiter(this, void 0, void 0, function () {
            var list;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.list(pluginId)];
                    case 1:
                        list = _a.sent();
                        return [2 /*return*/, list.plugin_versions[0]];
                }
            });
        });
    };
    /**
     * Fetches an instance of the {@link PluginVersionResource}
     * @param pluginId the plugin identifier
     * @param id the plugin version identifier
     */
    PluginVersionsClient.prototype.get = function (pluginId, id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.get(PluginVersionsClient.getUrl(pluginId, id), { cacheable: true })];
            });
        });
    };
    /**
     * Creates a new {@link PluginVersionResource}
     * @param pluginId the plugin identifier
     * @param object  the {@link CreatePluginVersionResource} request
     */
    PluginVersionsClient.prototype.create = function (pluginId, object) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.post(PluginVersionsClient.getUrl(pluginId), object)];
            });
        });
    };
    /**
     * Archives the {@link PluginVersionResource}
     * @param pluginId the plugin identifier
     * @param id the plugin version identifier to archive
     */
    PluginVersionsClient.prototype.archive = function (pluginId, id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.post(url_join_1.default(PluginVersionsClient.getUrl(pluginId, id), 'Archive'), {})];
            });
        });
    };
    return PluginVersionsClient;
}());
exports.default = PluginVersionsClient;
//# sourceMappingURL=pluginVersions.js.map