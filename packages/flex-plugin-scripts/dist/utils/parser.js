"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findFirstLocalPlugin = exports.parseUserInputPlugins = void 0;
var fs_1 = require("@twilio/flex-dev-utils/dist/fs");
var flex_dev_utils_1 = require("@twilio/flex-dev-utils");
var flex_plugin_webpack_1 = require("@twilio/flex-plugin-webpack");
/**
 * Reads user input to returns the --name plugins
 * --name plugin-test will run plugin-test locally
 * --name p
 * lugin-test@remote will run plugin-test remotely
 * --include-remote will include all remote plugins
 * @param failIfNotFound
 * @param args
 */
var parseUserInputPlugins = function (failIfNotFound) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var userInputPlugins = [];
    var config = fs_1.readPluginsJson();
    var _loop_1 = function (i) {
        if (args[i] !== '--name') {
            return "continue";
        }
        var groups = args[i + 1].match(flex_plugin_webpack_1.PLUGIN_INPUT_PARSER_REGEX);
        if (!groups) {
            throw new Error('Unexpected plugin name format was provided');
        }
        var name_1 = groups[1];
        var version = groups[2]; // later we'll use this for the @1.2.3 use case as well
        if (version === 'remote') {
            userInputPlugins.push({ name: name_1, remote: true });
            return "continue";
        }
        else if (version && flex_dev_utils_1.semver.valid(version)) {
            userInputPlugins.push({ name: name_1, remote: true, version: version });
            return "continue";
        }
        else if (version) {
            throw new flex_dev_utils_1.FlexPluginError("The version '" + version + "' is not a valid semver.");
        }
        var plugin = config.plugins.find(function (p) { return p.name === name_1; });
        if (!plugin && failIfNotFound) {
            throw new flex_dev_utils_1.FlexPluginError("No plugin file was found with the name '" + name_1 + "'");
        }
        if (plugin) {
            userInputPlugins.push({ name: plugin.name, remote: false });
        }
    };
    for (var i = 0; i < args.length - 1; i++) {
        _loop_1(i);
    }
    return userInputPlugins;
};
exports.parseUserInputPlugins = parseUserInputPlugins;
/**
 * Finds the first matched local plugin from provided CLI argument
 * @param plugins
 */
var findFirstLocalPlugin = function (plugins) {
    var localPlugin = plugins.find(function (p) { return !p.remote; });
    if (!localPlugin) {
        return undefined;
    }
    return fs_1.readPluginsJson().plugins.find(function (p) { return p.name === localPlugin.name; });
};
exports.findFirstLocalPlugin = findFirstLocalPlugin;
//# sourceMappingURL=parser.js.map