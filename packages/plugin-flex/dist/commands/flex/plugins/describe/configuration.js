"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const general_1 = require("../../../../utils/general");
const flex_plugin_1 = __importDefault(require("../../../../sub-commands/flex-plugin"));
const information_flex_plugin_1 = __importDefault(require("../../../../sub-commands/information-flex-plugin"));
/**
 * Describes the Flex Plugin Configuration
 */
class FlexPluginsDescribeConfiguration extends information_flex_plugin_1.default {
    async init() {
        this._flags = (await this.parseCommand(FlexPluginsDescribeConfiguration)).flags;
    }
    /**
     * @override
     */
    async getResource() {
        return this.pluginsApiToolkit.describeConfiguration({ sid: this._flags.sid });
    }
    /**
     * @override
     */
    /* c8 ignore next */
    notFound() {
        this._logger.info(`!!Configuration **${this._flags.sid}** was not found.!!`);
    }
    /**
     * @override
     */
    /* c8 ignore next */
    print(configuration) {
        this.printHeader('SID', configuration.sid);
        this.printHeader('Name', configuration.name);
        this.printHeader('Status', configuration.isActive);
        this.printHeader('Description', configuration.description);
        this.printHeader('Created', configuration.dateCreated);
        this._logger.newline();
        this.printHeader('Plugins');
        configuration.plugins.forEach((plugin) => {
            this.printVersion(plugin.name);
            this.printPretty(plugin, 'version', 'name');
            this._logger.newline();
        });
    }
    /**
     * @override
     */
    getTopicName() {
        return FlexPluginsDescribeConfiguration.topicName;
    }
}
exports.default = FlexPluginsDescribeConfiguration;
FlexPluginsDescribeConfiguration.topicName = 'flex:plugins:describe:configuration';
FlexPluginsDescribeConfiguration.description = general_1.createDescription(FlexPluginsDescribeConfiguration.topic.description, false);
FlexPluginsDescribeConfiguration.flags = Object.assign(Object.assign({}, flex_plugin_1.default.flags), { sid: command_1.flags.string({
        description: FlexPluginsDescribeConfiguration.topic.flags.sid,
        required: true,
    }) });
//# sourceMappingURL=configuration.js.map