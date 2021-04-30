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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The .describePlugin script. This script describes a plugin
 * @param pluginClient        the Public API {@link PluginsClient}
 * @param pluginVersionClient the Public API {@link PluginVersionsClient}
 * @param configuredPluginsClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
function describePlugin(pluginClient, pluginVersionClient, configuredPluginsClient, releasesClient) {
    var _this = this;
    return function (option) { return __awaiter(_this, void 0, void 0, function () {
        var resources, _a, plugin, versions, release, isPluginActive, formattedVersions, list_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    resources = option.resources ? option.resources : {};
                    return [4 /*yield*/, Promise.all([
                            resources.plugin ? Promise.resolve(resources.plugin) : pluginClient.get(option.name),
                            pluginVersionClient.list(option.name),
                            resources.activeRelease ? Promise.resolve(resources.activeRelease) : releasesClient.active(),
                        ])];
                case 1:
                    _a = __read.apply(void 0, [_b.sent(), 3]), plugin = _a[0], versions = _a[1], release = _a[2];
                    isPluginActive = false;
                    formattedVersions = versions.plugin_versions.map(function (version) { return ({
                        sid: version.sid,
                        version: version.version,
                        url: version.plugin_url,
                        changelog: version.changelog,
                        isPrivate: version.private,
                        isActive: false,
                        isArchived: version.archived,
                        dateCreated: version.date_created,
                    }); });
                    if (!release) return [3 /*break*/, 3];
                    return [4 /*yield*/, (resources.configuredPlugins
                            ? Promise.resolve(resources.configuredPlugins)
                            : configuredPluginsClient.list(release.configuration_sid))];
                case 2:
                    list_1 = _b.sent();
                    isPluginActive = list_1.plugins.some(function (p) { return p.plugin_sid === plugin.sid; });
                    formattedVersions.forEach(function (v) {
                        v.isActive = list_1.plugins.some(function (p) { return p.plugin_version_sid === v.sid; });
                    });
                    _b.label = 3;
                case 3: return [2 /*return*/, {
                        sid: plugin.sid,
                        name: plugin.unique_name,
                        friendlyName: plugin.friendly_name,
                        description: plugin.description,
                        isActive: isPluginActive,
                        isArchived: plugin.archived,
                        versions: formattedVersions,
                        dateCreated: plugin.date_created,
                        dateUpdated: plugin.date_updated,
                    }];
            }
        });
    }); };
}
exports.default = describePlugin;
//# sourceMappingURL=describePlugin.js.map