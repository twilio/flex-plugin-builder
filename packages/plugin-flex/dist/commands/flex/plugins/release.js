"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const flex_dev_utils_1 = require("@twilio/flex-dev-utils");
const command_1 = require("@oclif/command");
const errors_1 = require("@oclif/parser/lib/errors");
const general_1 = require("../../../utils/general");
const create_configuration_1 = __importDefault(require("../../../sub-commands/create-configuration"));
const descriptionFlex = 'description';
const nameFlex = 'name';
const enablePluginFlex = 'enable-plugin';
const disablePluginFlex = 'disable-plugin';
const newFlex = 'new';
const configurationSidFlex = 'configuration-sid';
/**
 * Creates a Flex Plugin Configuration and releases and sets it to active
 */
class FlexPluginsRelease extends create_configuration_1.default {
    constructor(argv, config, secureStorage) {
        super(argv, config, secureStorage, { runInDirectory: false });
        this.scriptArgs = [];
        this.prints = this._prints.release;
    }
    async init() {
        const parsed = await this.parseCommand(FlexPluginsRelease);
        if (parsed.flags[configurationSidFlex]) {
            this._flags = parsed.flags;
            return;
        }
        [descriptionFlex, nameFlex].forEach((key) => {
            if (!parsed.flags[key]) {
                throw new errors_1.RequiredFlagError({
                    flag: FlexPluginsRelease.flags[key],
                    parse: {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        input: {},
                        output: parsed,
                    },
                });
            }
        });
        const hasChange = [enablePluginFlex, disablePluginFlex].some((x) => parsed.flags[x]);
        if (!hasChange) {
            throw new errors_1.RequiredFlagError({
                flag: FlexPluginsRelease.flags[enablePluginFlex],
                parse: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    input: {},
                    output: parsed,
                },
            });
        }
        this._flags = parsed.flags;
    }
    /**
     * @override
     */
    async doRun() {
        if (this._flags[configurationSidFlex]) {
            await this.doCreateRelease(this._flags[configurationSidFlex]);
        }
        else {
            const config = await super.doCreateConfiguration();
            await this.doCreateRelease(config.sid);
        }
    }
    async doCreateRelease(configurationSid) {
        await flex_dev_utils_1.progress(`Enabling configuration **${configurationSid}**`, async () => this.createRelease(configurationSid), false);
        this.prints.releaseSuccessful(configurationSid);
    }
    /**
     * Registers a configuration with Plugins API
     * @returns {Promise}
     */
    async createRelease(configurationSid) {
        return this.pluginsApiToolkit.release({ configurationSid });
    }
    /**
     * @override
     */
    getTopicName() {
        return FlexPluginsRelease.topicName;
    }
}
exports.default = FlexPluginsRelease;
FlexPluginsRelease.topicName = 'flex:plugins:release';
FlexPluginsRelease.description = general_1.createDescription(FlexPluginsRelease.topic.description, false);
FlexPluginsRelease.flags = Object.assign(Object.assign({}, create_configuration_1.default.flags), { [configurationSidFlex]: command_1.flags.string({
        description: FlexPluginsRelease.topic.flags.configurationSid,
        exclusive: [descriptionFlex, nameFlex, newFlex],
    }), name: command_1.flags.string(Object.assign(Object.assign({}, create_configuration_1.default.nameFlag), { required: false, exclusive: [configurationSidFlex] })), plugin: command_1.flags.string(Object.assign(Object.assign({}, create_configuration_1.default.aliasEnablePluginFlag), { required: false, exclusive: [configurationSidFlex] })), [enablePluginFlex]: command_1.flags.string(Object.assign(Object.assign({}, create_configuration_1.default.enablePluginFlag), { required: false, exclusive: [configurationSidFlex] })), [disablePluginFlex]: command_1.flags.string(Object.assign(Object.assign({}, create_configuration_1.default.disablePluginFlag), { required: false, exclusive: [configurationSidFlex] })), description: command_1.flags.string(Object.assign(Object.assign({}, create_configuration_1.default.descriptionFlag), { required: false, exclusive: [configurationSidFlex] })) });
//# sourceMappingURL=release.js.map