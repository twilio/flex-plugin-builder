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
const path_1 = require("path");
const os_1 = require("os");
const fs_1 = require("@twilio/flex-dev-utils/dist/fs");
const cli_core_1 = require("@twilio/cli-core");
const flex_plugins_api_client_1 = require("@twilio/flex-plugins-api-client");
const flex_dev_utils_1 = require("@twilio/flex-dev-utils");
const spawn_1 = require("@twilio/flex-dev-utils/dist/spawn");
const dayjs_1 = __importDefault(require("dayjs"));
const Errors = __importStar(require("@oclif/errors"));
const mkdirp_1 = __importDefault(require("mkdirp"));
const parser_1 = __importDefault(require("../utils/parser"));
const flags = __importStar(require("../utils/flags"));
const general_1 = require("../utils/general");
const strings_1 = require("../utils/strings");
const prints_1 = __importDefault(require("../prints"));
const FlexConfigurationClient_1 = __importDefault(require("../clients/FlexConfigurationClient"));
const ServerlessClient_1 = __importDefault(require("../clients/ServerlessClient"));
const utils_1 = require("../utils");
const flexPluginScripts = '@twilio/flex-plugin-scripts';
const baseFlag = Object.assign({}, cli_core_1.baseCommands.TwilioClientCommand.flags);
delete baseFlag['cli-output-format'];
const packageJsonStr = 'package.json';
/**
 * Base class for all flex-plugin * scripts.
 * This will ensure the script is running on a Flex-plugin project, otherwise will throw an error
 */
class FlexPlugin extends cli_core_1.baseCommands.TwilioClientCommand {
    constructor(argv, config, secureStorage, opts) {
        super(argv, config, secureStorage);
        this.opts = Object.assign(Object.assign({}, FlexPlugin.defaultOptions), opts);
        this.showHeaders = true;
        this.cwd = process.cwd();
        this.pluginRootDir = path_1.join(__dirname, '../../');
        this.cliRootDir = path_1.join(os_1.homedir(), '.twilio-cli');
        this.skipEnvironmentalSetup = false;
        this._logger = new flex_dev_utils_1.Logger({ isQuiet: false, markdown: true });
        // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        this.cliPkg = require(path_1.join(this.pluginRootDir, packageJsonStr));
        this.version = this.cliPkg.version;
        if (!this.opts.strict) {
            // @ts-ignore
            this.constructor.strict = false;
        }
        this.exit = general_1.exit;
        const doubleDashIndex = argv.indexOf('--');
        this.internalScriptArgs = doubleDashIndex === -1 ? [] : argv.slice(doubleDashIndex + 1);
        if (doubleDashIndex !== -1) {
            process.argv = process.argv.slice(0, doubleDashIndex);
            this.argv = argv.slice(0, doubleDashIndex);
        }
        // TODO: get rid of scriptArgs and use argv instead
        this.scriptArgs = process.argv.slice(3);
        this._telemetryProperties = {};
    }
    /**
     * Getter for the topic
     */
    static get topic() {
        return utils_1.getTopic(this.topicName || '');
    }
    /**
     * Returns the version from the package.json if found, otherwise returns undefined
     * @param pkg
     */
    static getPackageVersion(pkg) {
        try {
            // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
            return require(path_1.join(pkg, packageJsonStr)).version;
        }
        catch (e) {
            return 'undefined';
        }
    }
    /**
     * Returns the formatted header field
     * @param key
     */
    /* c8 ignore next */
    static getHeader(key) {
        return strings_1.toSentenceCase(key);
    }
    /**
     * Parses the timestamp
     * @param timestamp
     */
    /* c8 ignore next */
    static parseDate(timestamp) {
        return dayjs_1.default(timestamp).format('MMM DD, YYYY H:mm:ssA');
    }
    /**
     * Returns the formatted value field
     * @param key
     * @param value
     */
    /* c8 ignore next */
    static getValue(key, value) {
        key = key.toLowerCase();
        if (FlexPlugin.DATE_FIELDS.includes(key)) {
            return `..!!${FlexPlugin.parseDate(value)}!!..`;
        }
        if (FlexPlugin.ACTIVE_FIELDS.includes(key)) {
            return value === true ? 'Active' : 'Inactive';
        }
        if (FlexPlugin.ACCESS_FIELDS.includes(key)) {
            return value === true ? 'Private' : 'Public';
        }
        return value;
    }
    /**
     * Checks the dir is a Flex plugin
     * @returns {boolean}
     */
    isPluginFolder() {
        if (!fs_1.checkAFileExists(this.cwd, packageJsonStr)) {
            return false;
        }
        const { pkg } = this;
        return ['@twilio/flex-ui'].every((dep) => dep in pkg.dependencies || dep in pkg.devDependencies);
    }
    /**
     * Gets the package.json
     * @returns {object}
     */
    get pkg() {
        const pkg = fs_1.readJsonFile(this.cwd, packageJsonStr);
        pkg.devDependencies = pkg.devDependencies || {};
        pkg.dependencies = pkg.dependencies || {};
        return pkg;
    }
    /**
     * Returns the major version of flex-plugin-scripts of the package
     */
    get builderVersion() {
        const { pkg } = this;
        const script = pkg.dependencies[flexPluginScripts] ||
            pkg.devDependencies[flexPluginScripts] ||
            pkg.dependencies['flex-plugin-scripts'] ||
            pkg.devDependencies['flex-plugin-scripts'];
        if (!script) {
            return null;
        }
        const version = flex_dev_utils_1.semver.coerce(script);
        if (!version) {
            return null;
        }
        return version.major;
    }
    /**
     * Gets an instantiated {@link FlexPluginsAPIToolkit}
     * @returns {FlexPluginsAPIToolkit}
     */
    get pluginsApiToolkit() {
        if (!this._pluginsApiToolkit) {
            throw new flex_dev_utils_1.TwilioCliError('PluginsApiToolkit is not initialized yet');
        }
        return this._pluginsApiToolkit;
    }
    /**
     * Gets an instantiated {@link PluginsClient}
     * @returns {PluginsClient}
     */
    get pluginsClient() {
        if (!this._pluginsClient) {
            throw new flex_dev_utils_1.TwilioCliError('PluginsClient is not initialized yet');
        }
        return this._pluginsClient;
    }
    /**
     * Gets an instantiated {@link PluginsClient}
     * @returns {PluginsClient}
     */
    get pluginVersionsClient() {
        if (!this._pluginVersionsClient) {
            throw new flex_dev_utils_1.TwilioCliError('PluginVersionsClient is not initialized yet');
        }
        return this._pluginVersionsClient;
    }
    /**
     * Gets an instantiated {@link ConfigurationsClient}
     * @returns {ConfigurationsClient}
     */
    get configurationsClient() {
        if (!this._configurationsClient) {
            throw new flex_dev_utils_1.TwilioCliError('ConfigurationsClient is not initialized yet');
        }
        return this._configurationsClient;
    }
    /**
     * Gets an instantiated {@link ReleasesClient}
     * @returns {ReleasesClient}
     */
    get releasesClient() {
        if (!this._releasesClient) {
            throw new flex_dev_utils_1.TwilioCliError('ReleasesClient is not initialized yet');
        }
        return this._releasesClient;
    }
    /**
     * Gets an instantiated {@link FlexConfigurationClient}
     * @returns {FlexConfigurationClient}
     */
    get flexConfigurationClient() {
        if (!this._flexConfigurationClient) {
            throw new flex_dev_utils_1.TwilioCliError('flexConfigurationClient is not initialized yet');
        }
        return this._flexConfigurationClient;
    }
    /**
     * Gets an instantiated {@link ServerlessClient}
     * @returns {ServerlessClient}
     */
    get serverlessClient() {
        if (!this._serverlessClient) {
            throw new flex_dev_utils_1.TwilioCliError('serverlessClient is not initialized yet');
        }
        return this._serverlessClient;
    }
    /**
     * Gets an instantiated {@link Telemetry}
     * @returns {Telemetry}
     */
    get telemetry() {
        if (!this._telemetry) {
            throw new flex_dev_utils_1.TwilioCliError('telementry is not initialized yet');
        }
        return this._telemetry;
    }
    /**
     * Returns the flex-ui version from the plugin
     */
    get flexUIVersion() {
        var _a;
        const flexUI = '@twilio/flex-ui';
        const dep = this.pkg.dependencies[flexUI] || this.pkg.devDependencies[flexUI];
        if (!dep) {
            throw new flex_dev_utils_1.TwilioCliError(`Package '${flexUI}' was not found`);
        }
        return ((_a = flex_dev_utils_1.semver.coerce(dep)) === null || _a === void 0 ? void 0 : _a.major) || FlexPlugin.DEFAULT_FLEX_UI_VERSION;
    }
    set telemetryProperties(properties) {
        this._telemetryProperties = Object.assign({}, properties);
    }
    async init() {
        this._flags = (await this.parseCommand(FlexPlugin)).flags;
    }
    /**
     * The main run command
     * @override
     */
    async run() {
        var _a;
        await super.run();
        await flex_dev_utils_1.checkForUpdate();
        fs_1.addCWDNodeModule();
        if (!this.skipEnvironmentalSetup) {
            await this.setupEnvironment();
        }
        this.logger.debug(`Using Plugins CLI version ${this.cliPkg.version}`);
        this.logger.debug(`Using Flex Plugins Config File: ${this.pluginsConfigPath}`);
        if ((_a = this._flags) === null || _a === void 0 ? void 0 : _a['clear-terminal']) {
            this._logger.clearTerminal();
        }
        if (this.opts.runInDirectory) {
            const pluginScriptVersion = FlexPlugin.getPackageVersion(path_1.join(this.cwd, 'node_modules', flexPluginScripts));
            this.logger.debug(`Using ${flexPluginScripts} version ${pluginScriptVersion}`);
            if (!this.isPluginFolder()) {
                throw new flex_dev_utils_1.TwilioCliError(this.pluginFolderErrorMessage);
            }
            if (this.checkCompatibility && this.builderVersion !== FlexPlugin.BUILDER_VERSION) {
                this._prints.flexPlugin.incompatibleVersion(this.pkg.name, this.builderVersion);
                this.exit(1);
            }
        }
        const pluginServiceOptions = this.getPluginServiceOptions();
        const flexConfigOptions = {
            accountSid: this.currentProfile.accountSid,
            username: this.twilioApiClient.username,
            password: this.twilioApiClient.password,
        };
        const httpClient = new flex_plugins_api_client_1.PluginServiceHTTPClient(this.twilioApiClient.username, this.twilioApiClient.password, pluginServiceOptions);
        this._pluginsApiToolkit = new flex_plugins_api_client_1.FlexPluginsAPIToolkit(this.twilioApiClient.username, this.twilioApiClient.password, pluginServiceOptions);
        this._pluginsClient = new flex_plugins_api_client_1.PluginsClient(httpClient);
        this._pluginVersionsClient = new flex_plugins_api_client_1.PluginVersionsClient(httpClient);
        this._configurationsClient = new flex_plugins_api_client_1.ConfigurationsClient(httpClient);
        this._releasesClient = new flex_plugins_api_client_1.ReleasesClient(httpClient);
        this._flexConfigurationClient = new FlexConfigurationClient_1.default(this.twilioClient.flexApi.v1.configuration.get(), flexConfigOptions);
        this._serverlessClient = new ServerlessClient_1.default(this.twilioClient.serverless.v1.services, this._logger);
        this._telemetry = new flex_dev_utils_1.Telemetry({ runAsync: this.opts.runTelemetryAsync });
        if (!this.isJson) {
            this._logger.notice(`Using profile **${this.currentProfile.id}** (${this.currentProfile.accountSid})`);
            this._logger.newline();
        }
        const start = performance.now();
        const result = await this.doRun();
        const end = performance.now();
        if (result && this.isJson && typeof result === 'object') {
            this._logger.info(JSON.stringify(result));
        }
        this.trackTopic(end - start, this._telemetryProperties);
    }
    /**
     * Catches any thrown exception
     * @param error
     */
    async catch(error) {
        if (general_1.instanceOf(error, flex_dev_utils_1.TwilioError)) {
            this._logger.error(error.message);
        }
        else if (general_1.instanceOf(error, Errors.CLIError)) {
            Errors.error(error.message);
        }
        else {
            super.catch(error);
        }
    }
    /**
     * OClif alias for run command
     * @alias for run
     */
    /* c8 ignore next */
    async runCommand() {
        return this.run();
    }
    /**
     * Runs a flex-plugin-scripts script
     * @param scriptName  the script name
     * @param argv        arguments to pass to the script
     */
    /* c8 ignore next */
    async runScript(scriptName, argv = this.scriptArgs) {
        const extra = [];
        if (scriptName !== 'test') {
            extra.push('--core-cwd', this.pluginRootDir);
            flex_dev_utils_1.env.setCLI();
        }
        // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        return require(`${flexPluginScripts}/dist/scripts/${scriptName}`).default(...argv, ...extra);
    }
    /**
     * Spawns a script
     * @param scriptName  the script to spawn
     * @param argv arguments to pass to the script
     */
    /* c8 ignore next */
    // @ts-ignore
    async spawnScript(scriptName, argv = this.scriptArgs) {
        const scriptPath = require.resolve(`${flexPluginScripts}/dist/scripts/${scriptName}`);
        flex_dev_utils_1.env.setCLI();
        return spawn_1.spawn('node', [scriptPath, ...argv, '--run-script', '--core-cwd', this.pluginRootDir]);
    }
    /**
     * Setups the environment. This must run after run command
     */
    async setupEnvironment() {
        process.env.SKIP_CREDENTIALS_SAVING = 'true';
        process.env.TWILIO_ACCOUNT_SID = this.twilioClient.username;
        process.env.TWILIO_AUTH_TOKEN = this.twilioClient.password;
        flex_dev_utils_1.env.setTwilioProfile(this.currentProfile.id);
        if (this._flags['cli-log-level'] === 'debug') {
            flex_dev_utils_1.env.setDebug();
            flex_dev_utils_1.env.persistTerminal();
        }
        if (this._flags.region) {
            flex_dev_utils_1.env.setRegion(this._flags.region);
        }
        else if (this.currentProfile.region) {
            flex_dev_utils_1.env.setRegion(this.currentProfile.region);
        }
        const shellCmd = ['npm', 'yarn'];
        for (const cmd of shellCmd) {
            const result = await spawn_1.spawn(cmd, ['-v'], {});
            if (result.exitCode === 0) {
                process.versions[cmd] = result.stdout;
            }
        }
    }
    /**
     * Prints pretty an object as a Key:Value pair
     * @param object    the object to print
     * @param ignoreList  the keys in the object to ignore
     */
    /* c8 ignore next */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    printPretty(object, ...ignoreList) {
        Object.keys(object)
            .filter((key) => !ignoreList.includes(key))
            .forEach((key) => {
            this._logger.info(`..│.. [[${strings_1.toSentenceCase(key)}]]: ${FlexPlugin.getValue(key, object[key])}`);
        });
    }
    /**
     * Prints the key/value pair as a main header
     * @param key the key
     * @param value the value
     */
    /* c8 ignore next */
    printHeader(key, value) {
        if (value === undefined) {
            this._logger.info(`**[[${FlexPlugin.getHeader(key)}:]]**`);
        }
        else {
            this._logger.info(`**[[${FlexPlugin.getHeader(key)}:]]** ${FlexPlugin.getValue(key, value)}`);
        }
    }
    /**
     * Prints the key/value as a "version" or instance header
     * @param key
     * @param otherKeys
     */
    /* c8 ignore next */
    printVersion(key, ...otherKeys) {
        if (otherKeys.length) {
            this._logger.info(`**@@${key}@@** ${otherKeys.join('')}`);
        }
        else {
            this._logger.info(`**@@${key}@@**`);
        }
    }
    /**
     * Abstract class method that each command should extend; this is the actual command that runs once initialization is
     * complete
     * @abstract
     * @returns {Promise<void>}
     */
    /* c8 ignore next */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async doRun() {
        throw new flex_dev_utils_1.NotImplementedError();
    }
    /**
     * Returns actual topicName
     * @returns {string}
     */
    getTopicName() {
        return FlexPlugin.topicName;
    }
    /**
     * Returns the error message text to display when the command is run outside of the plugin folder
     */
    get pluginFolderErrorMessage() {
        return `${this.cwd} directory is not a flex plugin directory. You must run the command inside a flex plugin directory`;
    }
    /**
     * Requires a check of compatibility
     */
    get checkCompatibility() {
        return false;
    }
    /**
     * Whether this is a JSON response
     */
    get isJson() {
        return this._flags.json;
    }
    /**
     * Get the cli plugin configuration
     */
    get pluginsConfig() {
        mkdirp_1.default.sync(path_1.join(this.cliRootDir, 'flex'));
        if (!fs_1.checkAFileExists(this.pluginsConfigPath)) {
            fs_1.writeJSONFile({ plugins: [] }, this.pluginsConfigPath);
        }
        return fs_1.readJsonFile(this.pluginsConfigPath);
    }
    /**
     * Returns the pluginsConfigPath
     */
    get pluginsConfigPath() {
        return path_1.join(this.cliRootDir, 'flex', 'plugins.json');
    }
    /**
     * Configures the success/error print messages
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    get _prints() {
        return prints_1.default(this._logger);
    }
    /**
     * Keep tracks of the command
     * @param timeTaken xtime for the command
     * @param properties additional properties for track events
     */
    trackTopic(timeTaken, properties) {
        properties = Object.assign({ cliVersion: this.cliPkg.version, command: this.getTopicName().startsWith(flex_dev_utils_1.COMMAND_PREFIX)
                ? this.getTopicName().slice(flex_dev_utils_1.COMMAND_PREFIX.length)
                : this.getTopicName(), xtime: Math.round(timeTaken) }, properties);
        this._telemetry.track(flex_dev_utils_1.TRACK_EVENT_NAME, this.currentProfile.accountSid, properties);
    }
    /**
     * The command parse override
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async parseCommand(options, argv = this.argv) {
        return parser_1.default(super.parse.bind(this))(options, argv);
    }
    /**
     * Generates the {@link PluginServiceHttpOption} options
     * @private
     */
    getPluginServiceOptions() {
        const packages = {
            [flexPluginScripts]: FlexPlugin.getPackageVersion(flexPluginScripts),
            cli: FlexPlugin.getPackageVersion('@twilio/cli-core'),
            'twilio-cli-flex-plugin': FlexPlugin.getPackageVersion(this.pluginRootDir),
            react: FlexPlugin.getPackageVersion('react'),
            'react-dom': FlexPlugin.getPackageVersion('react-dom'),
            '@twilio/flex-plugins-api-client': FlexPlugin.getPackageVersion('@twilio/flex-plugins-api-client'),
            'flex-ui': FlexPlugin.getPackageVersion(`@twilio/flex-ui`),
            isTs: 'unknown',
        };
        if (this.opts.runInDirectory) {
            packages.isTs = fs_1.getPaths().app.isTSProject().toString();
        }
        return {
            setUserAgent: true,
            caller: 'twilio-cli',
            packages,
        };
    }
}
exports.default = FlexPlugin;
FlexPlugin.topicName = 'flex:plugins';
FlexPlugin.BUILDER_VERSION = 7;
FlexPlugin.flags = Object.assign(Object.assign({}, baseFlag), { json: flags.boolean({
        description: FlexPlugin.topic.flags.json,
    }), 'clear-terminal': flags.boolean({
        description: FlexPlugin.topic.flags.clearTerminal,
    }), region: flags.enum({
        options: ['dev', 'stage'],
        default: process.env.TWILIO_REGION,
        hidden: true,
    }) });
FlexPlugin.DATE_FIELDS = ['datecreated', 'dateupdated', 'created', 'updated'];
FlexPlugin.ACTIVE_FIELDS = ['active', 'isactive', 'status'];
FlexPlugin.ACCESS_FIELDS = ['private', 'isprivate'];
FlexPlugin.DEFAULT_FLEX_UI_VERSION = 1;
FlexPlugin.defaultOptions = {
    strict: true,
    runInDirectory: true,
    runTelemetryAsync: true,
};
//# sourceMappingURL=flex-plugin.js.map