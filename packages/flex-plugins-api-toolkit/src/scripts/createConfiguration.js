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
var flex_plugin_utils_http_1 = require("flex-plugin-utils-http");
var flex_plugins_utils_exception_1 = require("flex-plugins-utils-exception");
var flex_plugins_utils_logger_1 = require("flex-plugins-utils-logger");
var pluginRegex = /^(?<name>[\w-]*)@(?<version>[\w\.-]*)$/;
/**
 * The .createConfiguration script. This script will create a Configuration
 * @param pluginClient        the Public API {@link PluginsClient}
 * @param pluginVersionClient the Public API {@link PluginVersionsClient}
 * @param configurationClient the Public API {@link ConfigurationsClient}
 * @param configuredPluginClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
function createConfiguration(pluginClient, pluginVersionClient, configurationClient, configuredPluginClient, releasesClient) {
    var _this = this;
    var getVersion = function (name, version) { return __awaiter(_this, void 0, void 0, function () {
        var resource, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!(version === 'latest')) return [3 /*break*/, 2];
                    return [4 /*yield*/, pluginVersionClient.latest(name)];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, pluginVersionClient.get(name, version)];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    resource = _a;
                    if (!resource) {
                        throw new flex_plugins_utils_exception_1.TwilioError("No plugin version was found for " + name);
                    }
                    return [2 /*return*/, resource];
            }
        });
    }); };
    return function (option) { return __awaiter(_this, void 0, void 0, function () {
        var pluginsValid, _a, removeList, list, release, items, plugins, createOption, configuration, configuredPluginsPage, installedPlugins;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    flex_plugins_utils_logger_1.logger.debug('Creating configuration with input', option);
                    pluginsValid = option.addPlugins.every(function (plugin) {
                        var match = plugin.match(pluginRegex);
                        return match && match.groups && match.groups.name && match.groups.version;
                    });
                    if (!pluginsValid) {
                        throw new flex_plugins_utils_exception_1.TwilioError('Plugins must be of the format pluginName@version');
                    }
                    // Change to sids
                    _a = option;
                    return [4 /*yield*/, Promise.all(option.addPlugins.map(function (plugin) { return __awaiter(_this, void 0, void 0, function () {
                            var match, _a, name, version, resource;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        match = plugin.match(pluginRegex);
                                        _a = match.groups, name = _a.name, version = _a.version;
                                        // this is checking whether the plugin exists - better for display error
                                        return [4 /*yield*/, pluginClient.get(name)];
                                    case 1:
                                        // this is checking whether the plugin exists - better for display error
                                        _b.sent();
                                        return [4 /*yield*/, getVersion(name, version)];
                                    case 2:
                                        resource = _b.sent();
                                        return [2 /*return*/, resource.plugin_sid + "@" + resource.sid];
                                }
                            });
                        }); }))];
                case 1:
                    // Change to sids
                    _a.addPlugins = _b.sent();
                    return [4 /*yield*/, Promise.all((option.removePlugins || [])
                            .map(function (name) { return __awaiter(_this, void 0, void 0, function () {
                            var plugin;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (flex_plugin_utils_http_1.looksLikeSid(name)) {
                                            return [2 /*return*/, name];
                                        }
                                        return [4 /*yield*/, pluginClient.get(name)];
                                    case 1:
                                        plugin = _a.sent();
                                        if (plugin.unique_name === name) {
                                            return [2 /*return*/, plugin.sid];
                                        }
                                        return [2 /*return*/, ''];
                                }
                            });
                        }); })
                            .filter(Boolean))];
                case 2:
                    removeList = _b.sent();
                    list = [];
                    if (!(option.fromConfiguration === 'active')) return [3 /*break*/, 4];
                    return [4 /*yield*/, releasesClient.active()];
                case 3:
                    release = _b.sent();
                    if (release) {
                        option.fromConfiguration = release.configuration_sid;
                    }
                    else {
                        delete option.fromConfiguration;
                    }
                    _b.label = 4;
                case 4:
                    if (!option.fromConfiguration) return [3 /*break*/, 6];
                    return [4 /*yield*/, configuredPluginClient.list(option.fromConfiguration)];
                case 5:
                    items = _b.sent();
                    list.push.apply(list, __spreadArray([], __read(items.plugins.map(function (p) { return p.plugin_sid + "@" + p.plugin_version_sid; }))));
                    option.addPlugins.forEach(function (a) {
                        var index = list.findIndex(function (l) { return a.split('@')[0] === l.split('@')[0]; });
                        if (index > -1) {
                            list[index] = a;
                        }
                        else {
                            list.push(a);
                        }
                    });
                    return [3 /*break*/, 7];
                case 6:
                    list.push.apply(list, __spreadArray([], __read(option.addPlugins)));
                    _b.label = 7;
                case 7: return [4 /*yield*/, Promise.all(list
                        .map(function (plugin) {
                        // @ts-ignore
                        var _a = plugin.match(pluginRegex).groups, name = _a.name, version = _a.version;
                        return {
                            name: name,
                            version: version,
                        };
                    })
                        .filter(function (_a) {
                        var name = _a.name;
                        return !removeList.includes(name);
                    })
                        .map(function (_a) {
                        var name = _a.name, version = _a.version;
                        return __awaiter(_this, void 0, void 0, function () {
                            var versionResource;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: 
                                    // This checks plugin exists
                                    return [4 /*yield*/, pluginClient.get(name)];
                                    case 1:
                                        // This checks plugin exists
                                        _b.sent();
                                        return [4 /*yield*/, getVersion(name, version)];
                                    case 2:
                                        versionResource = _b.sent();
                                        return [2 /*return*/, { plugin_version: versionResource.sid, phase: 3 }];
                                }
                            });
                        });
                    }))];
                case 8:
                    plugins = _b.sent();
                    createOption = {
                        Name: option.name,
                        Plugins: plugins,
                    };
                    if (option.description) {
                        createOption.Description = option.description;
                    }
                    return [4 /*yield*/, configurationClient.create(createOption)];
                case 9:
                    configuration = _b.sent();
                    return [4 /*yield*/, configuredPluginClient.list(configuration.sid)];
                case 10:
                    configuredPluginsPage = _b.sent();
                    return [4 /*yield*/, Promise.all(configuredPluginsPage.plugins.map(function (installedPlugin) { return __awaiter(_this, void 0, void 0, function () {
                            var plugin, version;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, pluginClient.get(installedPlugin.plugin_sid)];
                                    case 1:
                                        plugin = _a.sent();
                                        return [4 /*yield*/, pluginVersionClient.get(installedPlugin.plugin_sid, installedPlugin.plugin_version_sid)];
                                    case 2:
                                        version = _a.sent();
                                        return [2 /*return*/, {
                                                pluginSid: installedPlugin.plugin_sid,
                                                pluginVersionSid: installedPlugin.plugin_version_sid,
                                                name: installedPlugin.unique_name,
                                                version: installedPlugin.version,
                                                url: installedPlugin.plugin_url,
                                                phase: installedPlugin.phase,
                                                friendlyName: plugin.friendly_name,
                                                description: plugin.description,
                                                changelog: version.changelog,
                                                isPrivate: installedPlugin.private,
                                                isArchived: plugin.archived || version.archived,
                                            }];
                                }
                            });
                        }); }))];
                case 11:
                    installedPlugins = _b.sent();
                    return [2 /*return*/, {
                            sid: configuration.sid,
                            name: configuration.name,
                            description: configuration.description,
                            plugins: installedPlugins,
                            dateCreated: configuration.date_created,
                        }];
            }
        });
    }); };
}
exports.default = createConfiguration;
//# sourceMappingURL=createConfiguration.js.map