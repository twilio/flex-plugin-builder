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
const flags = __importStar(require("../../../../utils/flags"));
const archive_resource_1 = __importDefault(require("../../../../sub-commands/archive-resource"));
const general_1 = require("../../../../utils/general");
class FlexPluginsArchiveConfiguration extends archive_resource_1.default {
    async init() {
        this._flags = (await this.parseCommand(FlexPluginsArchiveConfiguration)).flags;
    }
    /**
     * @override
     */
    async doArchive() {
        return this.pluginsApiToolkit.archiveConfiguration({ sid: this._flags.sid });
    }
    /**
     * @override
     */
    getName() {
        return this._flags.sid;
    }
    /**
     * @override
     */
    getResourceType() {
        return 'Flex Configuration';
    }
    /**
     * @override
     */
    getTopicName() {
        return FlexPluginsArchiveConfiguration.topicName;
    }
}
exports.default = FlexPluginsArchiveConfiguration;
FlexPluginsArchiveConfiguration.topicName = 'flex:plugins:archive:configuration';
FlexPluginsArchiveConfiguration.description = general_1.createDescription(FlexPluginsArchiveConfiguration.topic.description, false);
FlexPluginsArchiveConfiguration.flags = Object.assign(Object.assign({}, archive_resource_1.default.flags), { sid: flags.string({
        description: FlexPluginsArchiveConfiguration.topic.flags.sid,
        required: true,
    }) });
//# sourceMappingURL=configuration.js.map