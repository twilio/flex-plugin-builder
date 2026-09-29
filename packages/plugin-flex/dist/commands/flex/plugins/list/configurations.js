"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const general_1 = require("../../../../utils/general");
const information_flex_plugin_1 = __importDefault(require("../../../../sub-commands/information-flex-plugin"));
/**
 * Lists the Flex Plugin Configurations
 */
class FlexPluginsListConfigurations extends information_flex_plugin_1.default {
    /**
     * @override
     */
    async getResource() {
        const result = await this.pluginsApiToolkit.listConfigurations({});
        return result.configurations;
    }
    /**
     * @override
     */
    /* c8 ignore next */
    notFound() {
        this._logger.info(`!!No configurations where not found.!!`);
    }
    /**
     * @override
     */
    /* c8 ignore next */
    print(configurations) {
        const list = this.sortByActive(configurations);
        list.forEach((configuration) => {
            this.printVersion(configuration.name, configuration.isActive ? '(Active)' : '');
            this.printPretty(configuration, 'name', 'isActive');
            this._logger.newline();
        });
    }
    /**
     * @override
     */
    getTopicName() {
        return FlexPluginsListConfigurations.topicName;
    }
}
exports.default = FlexPluginsListConfigurations;
FlexPluginsListConfigurations.topicName = 'flex:plugins:list:configurations';
FlexPluginsListConfigurations.description = general_1.createDescription(FlexPluginsListConfigurations.topic.description, false);
FlexPluginsListConfigurations.flags = Object.assign({}, information_flex_plugin_1.default.flags);
//# sourceMappingURL=configurations.js.map