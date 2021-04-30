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
var flex_plugins_utils_exception_1 = require("flex-plugins-utils-exception");
var RESPONSE_KEY = 'plugins';
/**
 * Plugin Public API Http client for the Plugin resource
 * @link https://www.twilio.com/docs/flex/plugins/api/plugin
 */
var PluginsClient = /** @class */ (function () {
    function PluginsClient(client) {
        this.client = client;
    }
    /**
     * Helper method to generate the URI for Plugins
     *
     * @param pluginId  the plugin identifier
     */
    PluginsClient.getUrl = function (pluginId) {
        if (pluginId) {
            return "Plugins/" + pluginId;
        }
        return 'Plugins';
    };
    /**
     * Fetches the list of {@link PluginResource}
     * @param pagination the pagination meta data
     */
    PluginsClient.prototype.list = function (pagination) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.list(PluginsClient.getUrl(), RESPONSE_KEY, pagination)];
            });
        });
    };
    /**
     * Fetches an instance of the {@link PluginResource}
     * @param id  the plugin identifier
     */
    PluginsClient.prototype.get = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.get(PluginsClient.getUrl(id), { cacheable: true })];
            });
        });
    };
    /**
     * Creates a new {@link PluginResource}
     * @param object the {@link CreatePluginResource} request
     */
    PluginsClient.prototype.create = function (object) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.post(PluginsClient.getUrl(), object)];
            });
        });
    };
    /**
     * Updates a {@link PluginResource}
     * @param id the plugin identifier
     * @param object the {@link UpdatePluginResource} request
     */
    PluginsClient.prototype.update = function (id, object) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.post(PluginsClient.getUrl(id), object)];
            });
        });
    };
    /**
     * Upserts a {@link PluginResource}. If no resource is found, then it creates it first, otherwise it will update it
     * @param object the {@link CreatePluginResource} request
     */
    PluginsClient.prototype.upsert = function (object) {
        return __awaiter(this, void 0, void 0, function () {
            var existingPlugin, FriendlyName, Description, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.get(object.UniqueName)];
                    case 1:
                        existingPlugin = _a.sent();
                        FriendlyName = object.FriendlyName, Description = object.Description;
                        if (FriendlyName || Description) {
                            return [2 /*return*/, this.update(object.UniqueName, { FriendlyName: FriendlyName, Description: Description })];
                        }
                        return [2 /*return*/, existingPlugin];
                    case 2:
                        e_1 = _a.sent();
                        if (e_1 instanceof flex_plugins_utils_exception_1.TwilioApiError && e_1.status === 404) {
                            return [2 /*return*/, this.create(object)];
                        }
                        throw e_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Archives the {@link PluginResource}
     * @param id  the plugin identifier to archive
     */
    PluginsClient.prototype.archive = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.client.post(url_join_1.default(PluginsClient.getUrl(id), 'Archive'), {})];
            });
        });
    };
    return PluginsClient;
}());
exports.default = PluginsClient;
//# sourceMappingURL=plugins.js.map