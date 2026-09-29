"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const flex_dev_utils_1 = require("@twilio/flex-dev-utils");
const general_1 = require("../../../../utils/general");
const flex_plugin_1 = __importDefault(require("../../../../sub-commands/flex-plugin"));
const information_flex_plugin_1 = __importDefault(require("../../../../sub-commands/information-flex-plugin"));
/**
 * Describes the Flex Plugin Release
 */
class FlexPluginsDescribeRelease extends information_flex_plugin_1.default {
    async init() {
        this._flags = (await this.parseCommand(FlexPluginsDescribeRelease)).flags;
    }
    /**
     * @override
     */
    async getResource() {
        if (this._flags.active) {
            const release = await this.releasesClient.active();
            if (!release) {
                throw new flex_dev_utils_1.TwilioApiError(20404, 'No active release was found', 404);
            }
            return this.pluginsApiToolkit.describeRelease({ sid: release === null || release === void 0 ? void 0 : release.sid });
        }
        return this.pluginsApiToolkit.describeRelease({ sid: this._flags.sid });
    }
    /**
     * @override
     */
    /* c8 ignore next */
    notFound() {
        this._logger.info(`!!Release **${this._flags.sid || 'active'}** was not found.!!`);
    }
    /**
     * @override
     */
    /* c8 ignore next */
    print(release) {
        this.printHeader('Sid', release.sid);
        this.printHeader('Status', release.isActive);
        this.printHeader('Created', release.dateCreated);
        this._logger.newline();
        this.printHeader('Configuration');
        this.printPretty(release.configuration, 'isActive', 'plugins');
        this._logger.newline();
        this.printHeader('Plugins');
        if (release.configuration.plugins.length === 0) {
            this._logger.info('There are no active plugins');
        }
        release.configuration.plugins.forEach((plugin) => {
            this.printVersion(plugin.name);
            this.printPretty(plugin);
            this._logger.newline();
        });
    }
    /**
     * @override
     */
    getTopicName() {
        return FlexPluginsDescribeRelease.topicName;
    }
}
exports.default = FlexPluginsDescribeRelease;
FlexPluginsDescribeRelease.topicName = 'flex:plugins:describe:release';
FlexPluginsDescribeRelease.description = general_1.createDescription(FlexPluginsDescribeRelease.topic.description, false);
FlexPluginsDescribeRelease.flags = Object.assign(Object.assign({}, flex_plugin_1.default.flags), { sid: command_1.flags.string({
        description: FlexPluginsDescribeRelease.topic.flags.sid,
        exclusive: ['active'],
    }), active: command_1.flags.boolean({
        description: FlexPluginsDescribeRelease.topic.flags.active,
        exclusive: ['sid'],
    }) });
//# sourceMappingURL=release.js.map