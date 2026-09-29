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
exports.parseVersionInput = void 0;
const deploy_1 = require("@twilio/flex-plugin-scripts/dist/scripts/deploy");
const runtime_1 = __importDefault(require("@twilio/flex-plugin-scripts/dist/utils/runtime"));
const errors_1 = require("@oclif/parser/lib/errors");
const flex_dev_utils_1 = require("@twilio/flex-dev-utils");
const fs_1 = require("@twilio/flex-dev-utils/dist/fs");
const flex_plugins_api_client_1 = require("@twilio/flex-plugins-api-client");
const flags = __importStar(require("../../../utils/flags"));
const general_1 = require("../../../utils/general");
const flex_plugin_1 = __importDefault(require("../../../sub-commands/flex-plugin"));
const ServerlessClient_1 = __importDefault(require("../../../clients/ServerlessClient"));
/**
 * Parses the version input
 * @param input
 */
const parseVersionInput = (input) => {
    if (!flex_dev_utils_1.semver.valid(input)) {
        const message = `Flag --version=${input} must be a valid SemVer`;
        throw new errors_1.CLIParseError({ parse: {}, message });
    }
    if (input === '0.0.0') {
        const message = `Flag --version=${input} cannot be 0.0.0`;
        throw new errors_1.CLIParseError({ parse: {}, message });
    }
    return input;
};
exports.parseVersionInput = parseVersionInput;
const baseFlags = Object.assign({}, flex_plugin_1.default.flags);
// @ts-ignore
delete baseFlags.json;
var Options;
(function (Options) {
    Options["Deploy"] = "deploy";
    Options["Fix"] = "fix";
})(Options || (Options = {}));
/**
 * Builds and then deploys the Flex Plugin
 */
class FlexPluginsDeploy extends flex_plugin_1.default {
    constructor(argv, config, secureStorage) {
        super(argv, config, secureStorage, {});
        this.options = {
            [Options.Fix]: '1. Go back and fix these issues now (recommended)',
            [Options.Deploy]: '2. Continue with the deployment, understanding the risks.',
        };
        this.nextVersion = undefined;
        this.scriptArgs = [];
        this.prints = this._prints.deploy;
    }
    async init() {
        this._flags = (await this.parseCommand(FlexPluginsDeploy)).flags;
    }
    /**
     * @override
     */
    async doRun() {
        await this.checkServerlessInstance();
        await this.checkForLegacy();
        const args = ['--quiet', '--persist-terminal'];
        const name = `**${this.pkg.name}**`;
        await flex_dev_utils_1.progress(`Verifying plugin version`, async () => {
            await this.validatePlugin();
        }, false);
        const { violations, vtime, error } = await flex_dev_utils_1.progress(`Validating plugin ${name}`, async () => {
            return this.runScript('validate', ['--deploy']);
        });
        const validateStatus = (error === null || error === void 0 ? void 0 : error.message) ? flex_plugins_api_client_1.ValidateStatus.Failure : flex_plugins_api_client_1.ValidateStatus.Success;
        if (error) {
            flex_dev_utils_1.logger.warning('Continuing to deploy');
        }
        let shouldContinue = this._flags['bypass-validation'] || this._flags.option === Options.Deploy || violations.length === 0;
        if (!shouldContinue && this._flags.option !== Options.Fix) {
            const choice = await flex_dev_utils_1.choose({
                name: 'deployment',
                message: 'Ignoring these issues could lead to unstable or unexpected behavior. Would you like to:',
                type: 'list',
            }, Object.values(this.options));
            shouldContinue = choice === this.options[Options.Deploy];
        }
        this.telemetryProperties = {
            violations,
            vtime: Math.round(vtime),
            error,
            bypassed: this._flags['bypass-validation'],
            deployed: 0,
        };
        if (shouldContinue) {
            await flex_dev_utils_1.progress(`Compiling a production build of ${name}`, async () => {
                await this.runScript('pre-script-check', args);
                const buildArgs = [...args];
                if (this.nextVersion) {
                    buildArgs.push('--version', this.nextVersion);
                }
                return this.runScript('build', [...buildArgs]);
            }, false);
            const hasCollisionAndOverwrite = await this.hasCollisionAndOverwrite();
            if (hasCollisionAndOverwrite) {
                args.push('--overwrite');
            }
            await deploy_1._verifyFlexUIConfiguration();
            const deployedData = await flex_dev_utils_1.progress(`Uploading ${name}`, async () => this.runScript('deploy', [...this.scriptArgs, ...args]), false);
            await flex_dev_utils_1.progress(`Registering plugin ${name} with Plugins API`, async () => this.registerPlugin(), false);
            const pluginVersion = await flex_dev_utils_1.progress(`Registering version **v${deployedData.nextVersion}** with Plugins API`, async () => this.registerPluginVersion(deployedData, validateStatus), false);
            /* c8 ignore next */
            this.prints.deploySuccessful(this.pkg.name, pluginVersion.private ? 'private' : 'public', deployedData, this.argv.includes('--profile') ? this.currentProfile.id : null);
            this.telemetryProperties = Object.assign(Object.assign({}, this.telemetryProperties), { deployed: 1 });
        }
    }
    /**
     * Checks if there is already an uploaded asset with the same version and prompts user with an option to override if so
     * @returns {Promise<boolean>}
     */
    async hasCollisionAndOverwrite() {
        if (flex_dev_utils_1.env.isCI()) {
            return false;
        }
        const credentials = await flex_dev_utils_1.getCredential();
        const runtime = await runtime_1.default(credentials);
        if (!runtime.environment) {
            throw new flex_dev_utils_1.FlexPluginError('No Runtime environment was found');
        }
        const pluginBaseUrl = fs_1.getPaths().assetBaseUrlTemplate.replace('%PLUGIN_VERSION%', this.nextVersion);
        const collision = runtime.build ? !deploy_1._verifyPath(pluginBaseUrl, runtime.build) : false;
        if (!collision) {
            return false;
        }
        return flex_dev_utils_1.confirm('Plugin package has already been uploaded previously for this version of the plugin. Would you like to overwrite it?', 'N');
    }
    /**
     * Validates that the provided next plugin version is valid
     * @returns {Promise<void>}
     */
    async validatePlugin() {
        let currentVersion = '0.0.0';
        try {
            // Plugin may not exist yet
            await this.pluginsClient.get(this.pkg.name);
            const pluginVersion = await this.pluginVersionsClient.latest(this.pkg.name);
            currentVersion = (pluginVersion && pluginVersion.version) || '0.0.0';
        }
        catch (e) {
            // No-op - no plugin exists yet; we'll create it later.
        }
        const nextVersion = this._flags.version || flex_dev_utils_1.semver.inc(currentVersion, this.bumpLevel);
        if (!flex_dev_utils_1.semver.valid(nextVersion)) {
            throw new flex_dev_utils_1.TwilioCliError(`${nextVersion} is not a valid semver`);
        }
        if (!flex_dev_utils_1.semver.gt(nextVersion, currentVersion)) {
            throw new flex_dev_utils_1.TwilioCliError(`The provided version ${nextVersion} must be greater than ${currentVersion}`);
        }
        // Set the plugin version
        this.nextVersion = nextVersion;
        this.scriptArgs.push('version', nextVersion);
        if (this._flags.public) {
            this.scriptArgs.push('--public');
        }
        return {
            currentVersion,
            nextVersion,
        };
    }
    /**
     * Registers a plugin with Plugins API
     * @returns {Promise}
     */
    async registerPlugin() {
        return this.pluginsClient.upsert({
            UniqueName: this.pkg.name,
            FriendlyName: this.pkg.name,
            Description: this._flags.description || '',
        });
    }
    /**
     * Registers a Plugin Version
     * @param deployResult
     * @returns {Promise}
     */
    async registerPluginVersion(deployResult, validateStatus) {
        return this.pluginVersionsClient.create(this.pkg.name, {
            Version: deployResult.nextVersion,
            PluginUrl: deployResult.pluginUrl,
            Private: !deployResult.isPublic,
            Changelog: this._flags.changelog || '',
            CliVersion: this.cliPkg.version || '',
            ValidateStatus: validateStatus,
        });
    }
    /**
     * Checks whether a Serverless instance exists or not. If not, will create one
     */
    async checkServerlessInstance() {
        const serviceSid = await this.flexConfigurationClient.getServerlessSid();
        if (serviceSid) {
            try {
                const service = await this.serverlessClient.getService(serviceSid);
                if (service.friendlyName !== ServerlessClient_1.default.NewService.friendlyName) {
                    await this.serverlessClient.updateServiceName(serviceSid);
                }
                return;
            }
            catch (e) {
                if (!general_1.instanceOf(e, flex_dev_utils_1.TwilioCliError)) {
                    throw e;
                }
                await this.flexConfigurationClient.unregisterServerlessSid(serviceSid);
            }
        }
        const service = await this.serverlessClient.getOrCreateDefaultService();
        await this.flexConfigurationClient.registerServerlessSid(service.sid);
    }
    /**
     * Checks to see if a legacy plugin exist
     */
    async checkForLegacy() {
        const serviceSid = await this.flexConfigurationClient.getServerlessSid();
        if (serviceSid) {
            const hasLegacy = await this.serverlessClient.hasLegacy(serviceSid, this.pkg.name);
            if (hasLegacy) {
                this.prints.warnHasLegacy();
            }
        }
    }
    /**
     * Finds the version bump level
     * @returns {string}
     */
    get bumpLevel() {
        if (this._flags.major) {
            return 'major';
        }
        if (this._flags.minor) {
            return 'minor';
        }
        return 'patch';
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
        return FlexPluginsDeploy.topicName;
    }
}
exports.default = FlexPluginsDeploy;
FlexPluginsDeploy.topicName = 'flex:plugins:deploy';
FlexPluginsDeploy.description = general_1.createDescription(FlexPluginsDeploy.topic.description, true);
FlexPluginsDeploy.flags = Object.assign(Object.assign({}, baseFlags), { patch: flags.boolean({
        description: FlexPluginsDeploy.topic.flags.patch,
        exclusive: ['minor', 'major', 'version'],
    }), minor: flags.boolean({
        description: FlexPluginsDeploy.topic.flags.minor,
        exclusive: ['patch', 'major', 'version'],
    }), major: flags.boolean({
        description: FlexPluginsDeploy.topic.flags.major,
        exclusive: ['patch', 'minor', 'version'],
    }), version: flags.string({
        description: FlexPluginsDeploy.topic.flags.version,
        exclusive: ['patch', 'minor', 'major'],
        parse: exports.parseVersionInput,
    }), public: flags.boolean({
        description: FlexPluginsDeploy.topic.flags.public,
        default: false,
    }), changelog: flags.string({
        description: FlexPluginsDeploy.topic.flags.changelog,
        required: true,
        max: 1000,
    }), description: flags.string({
        description: FlexPluginsDeploy.topic.flags.description,
        max: 500,
    }), option: flags.string({
        description: FlexPluginsDeploy.topic.flags.option,
        options: [Options.Deploy, Options.Fix],
        hidden: true,
    }), 'bypass-validation': flags.boolean({
        description: FlexPluginsDeploy.topic.flags['bypass-validation'],
        default: false,
    }) });
//# sourceMappingURL=deploy.js.map