"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const general_1 = require("../../../utils/general");
const flex_plugin_1 = __importDefault(require("../../../sub-commands/flex-plugin"));
const baseFlags = Object.assign({}, flex_plugin_1.default.flags);
// @ts-ignore
delete baseFlags.json;
/**
 * Builds the the plugin bundle
 */
class FlexPluginsTest extends flex_plugin_1.default {
    constructor(argv, config, secureStorage) {
        super(argv, config, secureStorage, { strict: false, runTelemetryAsync: false });
    }
    /**
     * @override
     */
    async doRun() {
        process.env.PERSIST_TERMINAL = 'true';
        await this.runScript('pre-script-check');
        await this.runScript('test', ['--env=jsdom', ...this.internalScriptArgs]);
    }
    /**
     * @override
     */
    get checkCompatibility() {
        return true;
    }
    /**
     * @override
     */
    getTopicName() {
        return FlexPluginsTest.topicName;
    }
}
exports.default = FlexPluginsTest;
FlexPluginsTest.topicName = 'flex:plugins:test';
FlexPluginsTest.description = general_1.createDescription(FlexPluginsTest.topic.description, true);
FlexPluginsTest.flags = Object.assign({}, baseFlags);
//# sourceMappingURL=test.js.map