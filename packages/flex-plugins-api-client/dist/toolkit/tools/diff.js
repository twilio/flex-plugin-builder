"use strict";
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
exports.findConfigurationsDiff = exports.buildDiff = void 0;
/**
 * Builds a diff
 * @param path  the path to the node
 * @param before  the before value
 * @param after   the after value
 */
var buildDiff = function (path, before, after) {
    return {
        path: path,
        before: before,
        after: after,
        hasDiff: before !== after,
    };
};
exports.buildDiff = buildDiff;
/**
 * Finds diff between two {@link DescribeConfiguration}
 * @param oldConfig the old {@link DescribeConfiguration}
 * @param newConfig the new {@link DescribeConfiguration}
 */
var findConfigurationsDiff = function (oldConfig, newConfig) {
    var diffs = {
        configuration: [],
        plugins: {},
    };
    exports.buildDiff('name', oldConfig.name, newConfig.name);
    diffs.configuration.push(exports.buildDiff('name', oldConfig.name, newConfig.name));
    diffs.configuration.push(exports.buildDiff('description', oldConfig.description, newConfig.description));
    diffs.configuration.push(exports.buildDiff('isActive', oldConfig.isActive, newConfig.isActive));
    diffs.configuration.push(exports.buildDiff('dateCreated', oldConfig.dateCreated, newConfig.dateCreated));
    oldConfig.plugins.forEach(function (oldPlugin) {
        var newPlugin = newConfig.plugins.find(function (p) { return p.pluginSid === oldPlugin.pluginSid; });
        // We've already added this, skip
        if (!diffs.plugins[oldPlugin.name]) {
            diffs.plugins[oldPlugin.name] = Object.entries(oldPlugin).map(function (_a) {
                var _b = __read(_a, 2), key = _b[0], value = _b[1];
                return exports.buildDiff(key, value, newPlugin && newPlugin[key]);
            });
        }
    });
    newConfig.plugins.forEach(function (newPlugin) {
        var oldPlugin = oldConfig.plugins.find(function (p) { return p.pluginSid === newPlugin.pluginSid; });
        // We've already added this, skip
        if (!diffs.plugins[newPlugin.name]) {
            diffs.plugins[newPlugin.name] = Object.entries(newPlugin).map(function (_a) {
                var _b = __read(_a, 2), key = _b[0], value = _b[1];
                return exports.buildDiff(key, oldPlugin && oldPlugin[key], value);
            });
        }
    });
    return diffs;
};
exports.findConfigurationsDiff = findConfigurationsDiff;
//# sourceMappingURL=diff.js.map