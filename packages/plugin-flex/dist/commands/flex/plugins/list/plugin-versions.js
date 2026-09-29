"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const general_1 = require("../../../../utils/general");
const information_flex_plugin_1 = __importDefault(require("../../../../sub-commands/information-flex-plugin"));
const flex_plugin_1 = __importDefault(require("../../../../sub-commands/flex-plugin"));
/**
 * Lists the Flex Plugin Versions
 */
class FlexPluginsListPluginVersions extends information_flex_plugin_1.default {
    async init() {
        this._flags = (await this.parseCommand(FlexPluginsListPluginVersions)).flags;
    }
    /**
     * @override
     */
    async getResource() {
        const result = await this.pluginsApiToolkit.listPluginVersions({ name: this._flags.name });
        return result.plugin_versions;
    }
    /**
     * @override
     */
    /* c8 ignore next */
    notFound() {
        this._logger.info(`!!Plugin **${this._flags.name}** was not found.!!`);
    }
    /**
     * @override
     */
    /* c8 ignore next */
    print(versions) {
        const list = this.sortByActive(versions);
        this.printHeader('Plugin Name', this._flags.name);
        if (list.length) {
            this.printHeader('Plugin SID', list[0].pluginSid);
        }
        this._logger.newline();
        this.printHeader('Versions');
        list.forEach((version) => {
            this.printVersion(version.version, version.isActive ? '(Active)' : '');
            this.printPretty(version, 'isActive', 'pluginSid', 'version');
            this._logger.newline();
        });
    }
    /**
     * @override
     */
    getTopicName() {
        return FlexPluginsListPluginVersions.topicName;
    }
}
exports.default = FlexPluginsListPluginVersions;
FlexPluginsListPluginVersions.topicName = 'flex:plugins:list:plugin-versions';
FlexPluginsListPluginVersions.description = general_1.createDescription(FlexPluginsListPluginVersions.topic.description, false);
FlexPluginsListPluginVersions.flags = Object.assign(Object.assign({}, flex_plugin_1.default.flags), { name: command_1.flags.string({
        description: FlexPluginsListPluginVersions.topic.flags.name,
        required: true,
    }) });
//# sourceMappingURL=plugin-versions.js.map