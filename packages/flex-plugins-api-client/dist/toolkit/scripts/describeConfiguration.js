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
exports.internalDescribeConfiguration = void 0;
/**
 * Internal method for returning configuration
 * @param configurationClient the Public API  {@link ConfigurationsClient}
 * @param configuredPluginClient the Public API {@link ConfiguredPluginsClient}
 */
function internalDescribeConfiguration(configurationClient, configuredPluginClient) {
    var _this = this;
    return function (option, release) { return __awaiter(_this, void 0, void 0, function () {
        var configuration, isActive, list, installedPlugins;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, configurationClient.get(option.sid)];
                case 1:
                    configuration = _a.sent();
                    isActive = Boolean(release && release.configuration_sid === configuration.sid);
                    return [4 /*yield*/, configuredPluginClient.list(option.sid)];
                case 2:
                    list = (_a.sent()).plugins;
                    installedPlugins = list.map(function (p) {
                        return {
                            pluginSid: p.plugin_sid,
                            pluginVersionSid: p.plugin_version_sid,
                            name: p.unique_name,
                            version: p.version,
                            url: p.plugin_url,
                            friendlyName: p.friendly_name,
                            description: p.description,
                            changelog: p.changelog,
                            isPrivate: p.private,
                            isArchived: p.plugin_archived || p.plugin_version_archived,
                            phase: p.phase,
                        };
                    });
                    return [2 /*return*/, {
                            sid: configuration.sid,
                            name: configuration.name,
                            description: configuration.description,
                            isActive: isActive,
                            isArchived: configuration.archived,
                            plugins: installedPlugins,
                            dateCreated: configuration.date_created,
                        }];
            }
        });
    }); };
}
exports.internalDescribeConfiguration = internalDescribeConfiguration;
/**
 * The .describeConfiguration script. This script describes a configuration.
 * @param configurationClient the Public API  {@link ConfigurationsClient}
 * @param configuredPluginClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
function describeConfiguration(configurationClient, configuredPluginClient, releasesClient) {
    var _this = this;
    return function (option) { return __awaiter(_this, void 0, void 0, function () {
        var resources, release;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    resources = option.resources ? option.resources : {};
                    return [4 /*yield*/, (resources.activeRelease
                            ? Promise.resolve(resources.activeRelease)
                            : releasesClient.active())];
                case 1:
                    release = _a.sent();
                    return [2 /*return*/, internalDescribeConfiguration(configurationClient, configuredPluginClient)(option, release)];
            }
        });
    }); };
}
exports.default = describeConfiguration;
//# sourceMappingURL=describeConfiguration.js.map