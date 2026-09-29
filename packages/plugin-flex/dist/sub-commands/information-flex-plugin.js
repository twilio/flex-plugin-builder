"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const flex_dev_utils_1 = require("@twilio/flex-dev-utils");
const flex_plugin_1 = __importDefault(require("./flex-plugin"));
/**
 * A helper class for the describe/list methods
 */
class InformationFlexPlugin extends flex_plugin_1.default {
    constructor(argv, config, secureStorage) {
        super(argv, config, secureStorage, { runInDirectory: false });
        this.scriptArgs = [];
    }
    /**
     * @override
     */
    async doRun() {
        try {
            const resource = await this.getResource();
            if (this.isJson) {
                return resource;
            }
            this.print(resource);
        }
        catch (e) {
            if (e.instanceOf && e.instanceOf(flex_dev_utils_1.TwilioApiError) && e.status === 404) {
                this.notFound();
                this.exit(1);
                return null;
            }
            throw e;
        }
        return null;
    }
    /**
     * Sorts an array of resource by its isActive property
     * @param list  the list to sort
     */
    sortByActive(list) {
        const active = list.find((r) => r.isActive);
        const inactive = list.filter((r) => !r.isActive);
        const sorted = [...inactive];
        if (active) {
            sorted.unshift(active);
        }
        return sorted;
    }
}
exports.default = InformationFlexPlugin;
InformationFlexPlugin.flags = Object.assign({}, flex_plugin_1.default.flags);
//# sourceMappingURL=information-flex-plugin.js.map