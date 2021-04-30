"use strict";
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
var flex_dev_utils_1 = require("flex-dev-utils");
/**
 * Error message for when a remote plugin is not found
 *
 * @param notFoundPlugins  name of the plugin
 * @param remotePlugins array of remote plugins
 */
exports.default = (function (notFoundPlugins, remotePlugins) {
    var e_1, _a, e_2, _b;
    flex_dev_utils_1.logger.clearTerminal();
    flex_dev_utils_1.logger.error('Server not loading because these plugins were not found remotely:');
    flex_dev_utils_1.logger.newline();
    try {
        for (var notFoundPlugins_1 = __values(notFoundPlugins), notFoundPlugins_1_1 = notFoundPlugins_1.next(); !notFoundPlugins_1_1.done; notFoundPlugins_1_1 = notFoundPlugins_1.next()) {
            var plugin = notFoundPlugins_1_1.value;
            flex_dev_utils_1.logger.error('\t', flex_dev_utils_1.logger.colors.bold(plugin));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (notFoundPlugins_1_1 && !notFoundPlugins_1_1.done && (_a = notFoundPlugins_1.return)) _a.call(notFoundPlugins_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    flex_dev_utils_1.logger.newline();
    flex_dev_utils_1.logger.error('Your remote plugins are:');
    flex_dev_utils_1.logger.newline();
    try {
        for (var remotePlugins_1 = __values(remotePlugins), remotePlugins_1_1 = remotePlugins_1.next(); !remotePlugins_1_1.done; remotePlugins_1_1 = remotePlugins_1.next()) {
            var plugin = remotePlugins_1_1.value;
            flex_dev_utils_1.logger.info("\t--**" + plugin.name + "**..@..**" + plugin.version + "**--");
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (remotePlugins_1_1 && !remotePlugins_1_1.done && (_b = remotePlugins_1.return)) _b.call(remotePlugins_1);
        }
        finally { if (e_2) throw e_2.error; }
    }
    flex_dev_utils_1.logger.newline();
});
//# sourceMappingURL=remotePluginNotFound.js.map