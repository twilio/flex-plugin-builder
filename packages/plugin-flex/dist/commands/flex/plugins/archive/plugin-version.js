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
class FlexPluginsArchivePluginVersion extends archive_resource_1.default {
    constructor() {
        super(...arguments);
        /**
         * Filters the asset by path
         * @param asset the asset to filter
         * @private
         */
        //  The type definition for this from the twilio-node library is broken
        // eslint-disable-next-line @typescript-eslint/ban-types
        this.filterAssetExists = (asset) => {
            const path = `/plugins/${this._flags.name}/${this._flags.version}/`;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return asset.path.includes(path);
        };
    }
    async init() {
        this._flags = (await this.parseCommand(FlexPluginsArchivePluginVersion)).flags;
    }
    /**
     * @override
     */
    async doArchive() {
        const { pluginVersion } = await flex_dev_utils_1.progress('Archiving Flex Plugin Version', async () => this.archiveOnPluginsAPI());
        if (pluginVersion.isArchived) {
            await flex_dev_utils_1.progress('Cleaning up Twilio Assets', async () => {
                const build = await this.getBuildIfActive();
                if (!build) {
                    throw new flex_dev_utils_1.TwilioApiError(20400, 'Plugin version is already archived', 400);
                }
                await this.removeServerlessFiles(build);
            });
        }
        return pluginVersion;
    }
    /**
     * @override
     */
    getName() {
        const { version, name } = this._flags;
        return `${name}@${version}`;
    }
    /**
     * @override
     */
    getResourceType() {
        return 'Flex Plugin Version';
    }
    /**
     * @override
     */
    getTopicName() {
        return FlexPluginsArchivePluginVersion.topicName;
    }
    /**
     * Archives the resource on flex-plugins-api service
     * @private
     */
    async archiveOnPluginsAPI() {
        try {
            const archivedPluginVersion = await this.pluginsApiToolkit.archivePluginVersion({
                name: this._flags.name,
                version: this._flags.version,
            });
            return { pluginVersion: archivedPluginVersion };
        }
        catch (e) {
            if (general_1.instanceOf(e, flex_dev_utils_1.TwilioApiError) && e.status === 400) {
                const archivedPluginVersion = await this.pluginsApiToolkit.describePluginVersion({
                    name: this._flags.name,
                    version: this._flags.version,
                });
                return { pluginVersion: archivedPluginVersion };
            }
            throw e;
        }
    }
    /**
     * Removes the serverless files
     * @param build  the active {@link BuildInstance} to remove the files from
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    async removeServerlessFiles(build) {
        var _a, _b, _c, _d;
        const request = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            functionVersions: (_a = build.functionVersions) === null || _a === void 0 ? void 0 : _a.map((f) => f.sid),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            assetVersions: (_b = build.assetVersions) === null || _b === void 0 ? void 0 : _b.filter((a) => !this.filterAssetExists(a)).map((a) => a.sid),
            // @ts-ignore this is a type definition error in Twilio; dependencies should be object[] not a string
            dependencies: build.dependencies,
            runtime: 'node12',
        };
        if (((_c = request.assetVersions) === null || _c === void 0 ? void 0 : _c.length) === 0 && ((_d = request.functionVersions) === null || _d === void 0 ? void 0 : _d.length) === 0) {
            const environment = await this.serverlessClient.getEnvironment(build.serviceSid, this._flags.name);
            if (environment) {
                await this.serverlessClient.deleteEnvironment(build.serviceSid, environment.sid);
            }
            return;
        }
        await this.serverlessClient.createBuildAndDeploy(build.serviceSid, this._flags.name, request);
    }
    /**
     * Returns the {@link BuildInstance} if found. It will also return undefined if the pluginVersion is not part of this build
     * @private
     */
    async getBuildIfActive() {
        const serviceSid = await this.flexConfigurationClient.getServerlessSid();
        if (!serviceSid) {
            return undefined;
        }
        const build = await this.serverlessClient.getBuild(serviceSid, this._flags.name);
        if (!(build === null || build === void 0 ? void 0 : build.assetVersions.find(this.filterAssetExists))) {
            return undefined;
        }
        return build;
    }
}
exports.default = FlexPluginsArchivePluginVersion;
FlexPluginsArchivePluginVersion.topicName = 'flex:plugins:archive:plugin-version';
FlexPluginsArchivePluginVersion.description = general_1.createDescription(FlexPluginsArchivePluginVersion.topic.description, false);
FlexPluginsArchivePluginVersion.flags = Object.assign(Object.assign({}, archive_resource_1.default.flags), { name: flags.string({
        description: FlexPluginsArchivePluginVersion.topic.flags.name,
        required: true,
    }), version: flags.string({
        description: FlexPluginsArchivePluginVersion.topic.flags.version,
        required: true,
    }) });
//# sourceMappingURL=plugin-version.js.map