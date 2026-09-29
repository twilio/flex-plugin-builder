"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const general_1 = require("../../../../utils/general");
const information_flex_plugin_1 = __importDefault(require("../../../../sub-commands/information-flex-plugin"));
/**
 * Lists the Flex Plugins
 */
class FlexPluginsListPlugins extends information_flex_plugin_1.default {
    /**
     * @override
     */
    async getResource() {
        const result = await this.pluginsApiToolkit.listPlugins({});
        return result.plugins;
    }
    /**
     * @override
     */
    /* c8 ignore next */
    notFound() {
        this._logger.info(`!!No plugins where not found.!!`);
    }
    /**
     * @override
     */
    /* c8 ignore next */
    print(plugins) {
        const activePlugins = plugins.filter((p) => p.isActive);
        const inactivePlugins = plugins.filter((p) => !p.isActive);
        this.printHeader('Active Plugins');
        activePlugins.forEach(this._print.bind(this));
        this._logger.newline();
        this.printHeader('Inactive Plugins');
        inactivePlugins.forEach(this._print.bind(this));
    }
    /**
     * @override
     */
    getTopicName() {
        return FlexPluginsListPlugins.topicName;
    }
    /* c8 ignore next */
    _print(plugin) {
        this.printVersion(plugin.name);
        this.printPretty(plugin, 'isActive', 'name');
        this._logger.newline();
    }
}
exports.default = FlexPluginsListPlugins;
FlexPluginsListPlugins.topicName = 'flex:plugins:list:plugins';
FlexPluginsListPlugins.description = general_1.createDescription(FlexPluginsListPlugins.topic.description, false);
FlexPluginsListPlugins.flags = Object.assign({}, information_flex_plugin_1.default.flags);
//# sourceMappingURL=plugins.js.map