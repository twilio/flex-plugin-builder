"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.diffScript = exports.archiveConfiguration = exports.archivePluginVersion = exports.archivePlugin = exports.describeReleaseScript = exports.listReleasesScript = exports.describeConfigurationScript = exports.listConfigurationsScript = exports.describePluginVersionScript = exports.listPluginVersionsScript = exports.describePluginScript = exports.listPluginsScript = exports.releaseScript = exports.createConfigurationScript = exports.deployScript = exports.ResourceNames = void 0;
// Plugins API resources
// eslint-disable-next-line no-shadow
var ResourceNames;
(function (ResourceNames) {
    ResourceNames["Plugins"] = "plugins";
    ResourceNames["PluginVersions"] = "plugin_versions";
    ResourceNames["Configurations"] = "configurations";
    ResourceNames["Releases"] = "releases";
})(ResourceNames = exports.ResourceNames || (exports.ResourceNames = {}));
var deploy_1 = require("./deploy");
Object.defineProperty(exports, "deployScript", { enumerable: true, get: function () { return __importDefault(deploy_1).default; } });
var createConfiguration_1 = require("./createConfiguration");
Object.defineProperty(exports, "createConfigurationScript", { enumerable: true, get: function () { return __importDefault(createConfiguration_1).default; } });
var release_1 = require("./release");
Object.defineProperty(exports, "releaseScript", { enumerable: true, get: function () { return __importDefault(release_1).default; } });
var listPlugins_1 = require("./listPlugins");
Object.defineProperty(exports, "listPluginsScript", { enumerable: true, get: function () { return __importDefault(listPlugins_1).default; } });
var describePlugin_1 = require("./describePlugin");
Object.defineProperty(exports, "describePluginScript", { enumerable: true, get: function () { return __importDefault(describePlugin_1).default; } });
var listPluginVerions_1 = require("./listPluginVerions");
Object.defineProperty(exports, "listPluginVersionsScript", { enumerable: true, get: function () { return __importDefault(listPluginVerions_1).default; } });
var describePluginVersion_1 = require("./describePluginVersion");
Object.defineProperty(exports, "describePluginVersionScript", { enumerable: true, get: function () { return __importDefault(describePluginVersion_1).default; } });
var listConfigurations_1 = require("./listConfigurations");
Object.defineProperty(exports, "listConfigurationsScript", { enumerable: true, get: function () { return __importDefault(listConfigurations_1).default; } });
var describeConfiguration_1 = require("./describeConfiguration");
Object.defineProperty(exports, "describeConfigurationScript", { enumerable: true, get: function () { return __importDefault(describeConfiguration_1).default; } });
var listReleases_1 = require("./listReleases");
Object.defineProperty(exports, "listReleasesScript", { enumerable: true, get: function () { return __importDefault(listReleases_1).default; } });
var describeRelease_1 = require("./describeRelease");
Object.defineProperty(exports, "describeReleaseScript", { enumerable: true, get: function () { return __importDefault(describeRelease_1).default; } });
var archivePlugin_1 = require("./archivePlugin");
Object.defineProperty(exports, "archivePlugin", { enumerable: true, get: function () { return __importDefault(archivePlugin_1).default; } });
var archivePluginVersion_1 = require("./archivePluginVersion");
Object.defineProperty(exports, "archivePluginVersion", { enumerable: true, get: function () { return __importDefault(archivePluginVersion_1).default; } });
var archiveConfiguration_1 = require("./archiveConfiguration");
Object.defineProperty(exports, "archiveConfiguration", { enumerable: true, get: function () { return __importDefault(archiveConfiguration_1).default; } });
var diff_1 = require("./diff");
Object.defineProperty(exports, "diffScript", { enumerable: true, get: function () { return __importDefault(diff_1).default; } });
//# sourceMappingURL=index.js.map