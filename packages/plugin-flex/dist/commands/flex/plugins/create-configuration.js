"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const general_1 = require("../../../utils/general");
const create_configuration_1 = __importDefault(require("../../../sub-commands/create-configuration"));
/**
 * Creates a Flex Plugin Configuration
 */
class FlexPluginsCreateConfiguration extends create_configuration_1.default {
    constructor(argv, config, secureStorage) {
        super(argv, config, secureStorage, { runInDirectory: false });
        this.scriptArgs = [];
    }
    /**
     * @override
     */
    async doRun() {
        const config = await this.doCreateConfiguration();
        this._logger.newline();
        this._logger.success(`🚀 Configuration **${config.sid}** was successfully created`);
        this._logger.newline();
        this._logger.info('**Next Steps:**');
        this._logger.info(`Run {{$ twilio flex:plugins:release --configuration-sid ${config.sid}}} to enable this configuration on your Flex instance`);
        this._logger.newline();
    }
    /**
     * @override
     */
    getTopicName() {
        return FlexPluginsCreateConfiguration.topicName;
    }
}
exports.default = FlexPluginsCreateConfiguration;
FlexPluginsCreateConfiguration.topicName = 'flex:plugins:create-configuration';
FlexPluginsCreateConfiguration.description = general_1.createDescription(FlexPluginsCreateConfiguration.topic.description, true);
FlexPluginsCreateConfiguration.flags = Object.assign({}, create_configuration_1.default.flags);
//# sourceMappingURL=create-configuration.js.map