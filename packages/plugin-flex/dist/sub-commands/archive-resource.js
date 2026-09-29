"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const flex_dev_utils_1 = require("@twilio/flex-dev-utils");
const flex_plugin_1 = __importDefault(require("./flex-plugin"));
const general_1 = require("../utils/general");
const baseFlags = Object.assign({}, flex_plugin_1.default.flags);
// @ts-ignore
delete baseFlags.json;
class ArchiveResource extends flex_plugin_1.default {
    constructor(argv, config, secureStorage) {
        super(argv, config, secureStorage, { runInDirectory: false });
        this.scriptArgs = [];
        this.prints = this._prints.archiveResource;
    }
    /**
     * @override
     */
    async doRun() {
        const name = `**${this.getName()}**`;
        const assetsRemovalMsg = this.getResourceType() === 'Flex Plugin'
            ? `This will remove the plugin's packages uploaded to Twilio Assets and cannot be undone. `
            : '';
        const doArchive = await flex_dev_utils_1.confirm(`Are you sure you want to archive ${this.getResourceType()} ${this.getName()}? ${assetsRemovalMsg}Once archived, it cannot be undone.`, 'N');
        if (!doArchive) {
            this.exit(0);
            return;
        }
        try {
            const result = await this.doArchive();
            if (result.isArchived) {
                this.prints.archivedSuccessfully(name);
            }
            else {
                this.prints.archivedFailed(name);
            }
        }
        catch (e) {
            if (general_1.instanceOf(e, flex_dev_utils_1.TwilioApiError) && e.status === 400) {
                this.prints.alreadyArchived(name, e.message);
            }
            else {
                throw e;
            }
        }
    }
}
exports.default = ArchiveResource;
ArchiveResource.topicName = 'flex:plugins:archive';
ArchiveResource.description = general_1.createDescription(ArchiveResource.topic.description, true);
ArchiveResource.flags = Object.assign({}, baseFlags);
//# sourceMappingURL=archive-resource.js.map