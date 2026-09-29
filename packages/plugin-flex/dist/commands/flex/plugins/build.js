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
class FlexPluginsBuild extends flex_plugin_1.default {
    /**
     * @override
     */
    async doRun() {
        process.env.PERSIST_TERMINAL = 'true';
        await this.runScript('pre-script-check');
        await this.runScript('build');
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
        return FlexPluginsBuild.topicName;
    }
}
exports.default = FlexPluginsBuild;
FlexPluginsBuild.topicName = 'flex:plugins:build';
FlexPluginsBuild.description = general_1.createDescription(FlexPluginsBuild.topic.description, true);
FlexPluginsBuild.flags = Object.assign({}, baseFlags);
//# sourceMappingURL=build.js.map