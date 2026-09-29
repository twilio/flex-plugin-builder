"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetsUrl = exports.getRuntimeUrl = void 0;
/**
 * Gets the Twilio Runtime URL
 * @return {string} the url of Twilio Runtime
 */
var getRuntimeUrl = function () {
    if (document && document.currentScript) {
        var pluginScript = document.currentScript;
        if (typeof pluginScript.src === 'string') {
            var pluginUrl = pluginScript.src;
            return pluginUrl.substr(0, pluginUrl.lastIndexOf('/'));
        }
    }
    return '';
};
exports.getRuntimeUrl = getRuntimeUrl;
/**
 * Gets the base URL for Twilio Runtime Assets
 * @return {string} the url of Assets
 */
var getAssetsUrl = function () {
    return exports.getRuntimeUrl() + "/assets";
};
exports.getAssetsUrl = getAssetsUrl;
//# sourceMappingURL=runtime.js.map