"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Prints error about incompatibility
 */
var incompatibleVersion = function (logger) { return function (name, version) {
    logger.error("The plugin " + name + " version (v" + version + ") is not compatible with this CLI command.");
    logger.newline();
    logger.info('Run {{$ twilio flex:plugins:upgrade-plugin \\-\\-beta \\-\\-install}} to upgrade your plugin.');
}; };
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
exports.default = (function (logger) { return ({
    incompatibleVersion: incompatibleVersion(logger),
}); });
//# sourceMappingURL=flexPlugin.js.map