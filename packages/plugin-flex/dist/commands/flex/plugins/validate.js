"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("@oclif/parser");
const general_1 = require("../../../utils/general");
const flex_plugin_1 = __importDefault(require("../../../sub-commands/flex-plugin"));
const baseFlags = Object.assign({}, flex_plugin_1.default.flags);
// @ts-ignore
delete baseFlags.json;
/**
 * Validates the plugin
 */
// eslint-disable-next-line import/no-unused-modules
class FlexPluginValidate extends flex_plugin_1.default {
    async init() {
        this._flags = (await this.parseCommand(FlexPluginValidate)).flags;
    }
    /**
     * @override
     */
    async doRun() {
        process.env.PERSIST_TERMINAL = 'true';
        this.scriptArgs = this._flags['flex-ui-2.0'] ? ['--flex-ui-2.0'] : [];
        const { violations, vtime, error } = (await this.runScript('validate'));
        this.telemetryProperties = { violations, vtime: Math.round(vtime), error, deployed: 0 };
    }
    /**
     * @override
     */
    getTopicName() {
        return FlexPluginValidate.topicName;
    }
    /**
     * @override
     */
    get checkCompatibility() {
        return true;
    }
}
exports.default = FlexPluginValidate;
FlexPluginValidate.topicName = 'flex:plugins:validate';
FlexPluginValidate.description = general_1.createDescription(FlexPluginValidate.topic.description, false);
FlexPluginValidate.flags = Object.assign(Object.assign({}, baseFlags), { 'flex-ui-2.0': parser_1.flags.boolean({
        description: FlexPluginValidate.topic.flags.flexui2,
        default: false,
    }) });
//# sourceMappingURL=validate.js.map