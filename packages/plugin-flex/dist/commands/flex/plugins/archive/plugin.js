"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const flex_dev_utils_1 = require("@twilio/flex-dev-utils");
const flags = __importStar(require("../../../../utils/flags"));
const archive_resource_1 = __importDefault(require("../../../../sub-commands/archive-resource"));
const general_1 = require("../../../../utils/general");
class FlexPluginsArchivePlugin extends archive_resource_1.default {
    async init() {
        this._flags = (await this.parseCommand(FlexPluginsArchivePlugin)).flags;
    }
    /**
     * @override
     */
    async doArchive() {
        const alreadyArchived = 'Plugin is already archived.';
        const response = await flex_dev_utils_1.progress('Archiving Flex Plugin', async () => this.archiveOnPluginsAPI());
        if (!response.alreadyArchived || (response.message && response.message.includes(alreadyArchived))) {
            await flex_dev_utils_1.progress('Cleaning up Twilio Environment', async () => this.removeServerlessEnvironment(response.alreadyArchived));
        }
        return response.plugin;
    }
    /**
     * @override
     */
    getName() {
        return this._flags.name;
    }
    /**
     * @override
     */
    getResourceType() {
        return 'Flex Plugin';
    }
    /**
     * @override
     */
    getTopicName() {
        return FlexPluginsArchivePlugin.topicName;
    }
    /**
     * Archives the resource on flex-plugins-api service
     * @private
     */
    async archiveOnPluginsAPI() {
        try {
            const plugin = await this.pluginsApiToolkit.archivePlugin({
                name: this._flags.name,
            });
            return {
                plugin,
                alreadyArchived: false,
            };
        }
        catch (e) {
            if (general_1.instanceOf(e, flex_dev_utils_1.TwilioApiError) && e.status === 400) {
                const plugin = await this.pluginsApiToolkit.describePlugin({
                    name: this._flags.name,
                });
                return {
                    plugin,
                    alreadyArchived: true,
                    message: e.message,
                };
            }
            throw e;
        }
    }
    /**
     * Removes the {@link EnvironmentInstance}
     * @param alreadyArchived whether the resource on plugins-api is already archived or not
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    async removeServerlessEnvironment(alreadyArchived) {
        const serviceSid = await this.flexConfigurationClient.getServerlessSid();
        if (!serviceSid) {
            if (alreadyArchived) {
                throw new flex_dev_utils_1.TwilioApiError(20400, 'Plugin is already archived', 400);
            }
            return;
        }
        const environment = await this.serverlessClient.getEnvironment(serviceSid, this._flags.name);
        if (!environment) {
            if (alreadyArchived) {
                throw new flex_dev_utils_1.TwilioApiError(20400, 'Plugin is already archived', 400);
            }
            return;
        }
        const isSuccessful = await this.serverlessClient.deleteEnvironment(serviceSid, environment.sid);
        if (!isSuccessful) {
            throw new flex_dev_utils_1.TwilioCliError('Could not archive your plugin due to failure in deleting the environment hosting your plugin. Please retry by running the archive command.');
        }
    }
}
exports.default = FlexPluginsArchivePlugin;
FlexPluginsArchivePlugin.topicName = 'flex:plugins:archive:plugin';
FlexPluginsArchivePlugin.description = general_1.createDescription(FlexPluginsArchivePlugin.topic.description, false);
FlexPluginsArchivePlugin.flags = Object.assign(Object.assign({}, archive_resource_1.default.flags), { name: flags.string({
        description: FlexPluginsArchivePlugin.topic.flags.name,
        required: true,
    }) });
//# sourceMappingURL=plugin.js.map