"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cli_core_1 = require("@twilio/cli-core");
const create_flex_plugin_1 = __importDefault(require("@twilio/create-flex-plugin"));
const command_1 = require("@oclif/command");
const flex_dev_utils_1 = require("@twilio/flex-dev-utils");
const general_1 = require("../../../utils/general");
/**
 * Creates a new Flex plugin
 */
// @ts-ignore
// eslint-disable-next-line import/no-unused-modules
class FlexPluginsCreate extends cli_core_1.baseCommands.TwilioClientCommand {
    constructor(argv, config, secureStorage) {
        super(argv, config, secureStorage);
        this.showHeaders = true;
    }
    /**
     * Converts yArgs to OClif flags
     *
     * @param yargs   the yargs flags
     * @returns the OClif args
     */
    static parseYargs(yargs) {
        return Object.keys(yargs).reduce((result, key) => {
            const arg = yargs[key];
            const flagType = arg.type || 'string';
            result[key] = command_1.flags[flagType]({
                char: arg.alias,
                description: arg.describe,
                default: arg.default,
                required: false,
            });
            return result;
        }, {});
    }
    /**
     * Converts args to arvg array
     *
     * @param args      the args
     * @returns {Array}
     */
    static toArgv(args) {
        return Object.keys(args).reduce((result, key) => {
            result.push(`--${key}`, args[key]);
            return result;
        }, []);
    }
    /**
     * Main script to run
     *
     * @returns {Promise<void>}
     */
    async run() {
        await super.run();
        await flex_dev_utils_1.checkForUpdate();
        // @ts-ignore
        const { flags: instanceFlags, args } = await this.parse(FlexPluginsCreate);
        if (!instanceFlags.accountSid && this.currentProfile && this.currentProfile.accountSid) {
            instanceFlags.accountSid = this.currentProfile.accountSid;
        }
        if (!flex_dev_utils_1.env.getRegion() && this.currentProfile && this.currentProfile.region) {
            flex_dev_utils_1.env.setRegion(this.currentProfile.region);
        }
        const createFlexPlugin = new create_flex_plugin_1.default();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const scriptArgs = FlexPluginsCreate.toArgv(instanceFlags);
        scriptArgs.unshift(args.name);
        await createFlexPlugin.parse(...scriptArgs);
    }
    async runCommand() {
        return this.run();
    }
}
exports.default = FlexPluginsCreate;
FlexPluginsCreate.description = general_1.createDescription(create_flex_plugin_1.default.description);
FlexPluginsCreate.flags = Object.assign({}, FlexPluginsCreate.parseYargs(create_flex_plugin_1.default.flags));
FlexPluginsCreate.args = [
    {
        name: 'name',
        required: true,
        description: create_flex_plugin_1.default.description,
    },
];
//# sourceMappingURL=create.js.map