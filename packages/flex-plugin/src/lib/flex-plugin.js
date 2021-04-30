"use strict";
/// <reference path="../module.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadPlugin = exports.FlexPlugin = void 0;
/**
 * Base class for creating a Flex Plugin
 */
var FlexPlugin = /** @class */ (function () {
    function FlexPlugin(name) {
        this.uniqueName = __FPB_PLUGIN_UNIQUE_NAME;
        this.version = __FPB_PLUGIN_VERSION;
        this.dependencies = {
            'flex-plugin-scripts': __FPB_FLEX_PLUGIN_SCRIPTS_VERSION,
            'flex-plugin': __FPB_FLEX_PLUGIN_VERSION,
            'flex-ui': __FPB_FLEX_UI_VERSION,
            react: __FPB_REACT_VERSION,
            'react-dom': __FPB_REACT_DOM_VERSION,
        };
        this.name = name;
        // eslint-disable-next-line no-console
        console.log("loading " + this.name + "@" + this.version + " plugin");
    }
    return FlexPlugin;
}());
exports.FlexPlugin = FlexPlugin;
/**
 * Plugin loader helper function
 * @param plugin
 */
var loadPlugin = function (plugin) {
    if (Twilio && Twilio.Flex && Twilio.Flex.Plugins) {
        Twilio.Flex.Plugins.init(plugin);
    }
    else {
        // eslint-disable-next-line no-console
        console.warn('This version of Flex does not appear to support plugins.');
    }
};
exports.loadPlugin = loadPlugin;
//# sourceMappingURL=flex-plugin.js.map