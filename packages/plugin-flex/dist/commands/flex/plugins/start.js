"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const flex_plugin_scripts_1 = require("@twilio/flex-plugin-scripts");
const start_1 = require("@twilio/flex-plugin-scripts/dist/scripts/start");
const pre_script_check_1 = require("@twilio/flex-plugin-scripts/dist/scripts/pre-script-check");
const flex_dev_utils_1 = require("@twilio/flex-dev-utils");
const fs_1 = require("@twilio/flex-dev-utils/dist/fs");
const general_1 = require("../../../utils/general");
const flex_plugin_1 = __importDefault(require("../../../sub-commands/flex-plugin"));
const baseFlags = Object.assign({}, flex_plugin_1.default.flags);
// @ts-ignore
delete baseFlags.json;
const MULTI_PLUGINS_PILOT = pre_script_check_1.FLAG_MULTI_PLUGINS.substring(2);
/**
 * Starts the dev-server for building and iterating on a plugin bundle
 */
class FlexPluginsStart extends flex_plugin_1.default {
    constructor(argv, config, secureStorage) {
        super(argv, config, secureStorage, { strict: false, runTelemetryAsync: false });
    }
    async init() {
        this._flags = (await this.parseCommand(FlexPluginsStart)).flags;
        if (this._flags['include-remote'] || this._flags.name) {
            this.opts.runInDirectory = false;
        }
    }
    /**
     * @override
     */
    async doRun() {
        const flexArgs = [];
        const localPluginNames = [];
        if (this._flags.name) {
            for (const name of this._flags.name) {
                flexArgs.push('--name', name);
                const groups = name.match(flex_plugin_scripts_1.PLUGIN_INPUT_PARSER_REGEX);
                if (!groups) {
                    throw new flex_dev_utils_1.TwilioCliError('Unexpected plugin format was provided.');
                }
                const pluginName = groups[1];
                const version = groups[2];
                // local plugin
                if (!version) {
                    localPluginNames.push(name);
                    continue;
                }
                // remote plugin
                if (version === 'remote') {
                    continue;
                }
                if (!flex_dev_utils_1.semver.valid(version)) {
                    throw new flex_dev_utils_1.TwilioCliError(`Version ${version} is not a valid semver string.`);
                }
                await this.checkPluginVersionExists(pluginName, version);
            }
        }
        if (this._flags['include-remote']) {
            flexArgs.push('--include-remote');
        }
        if (this._flags['flex-ui-source']) {
            flex_dev_utils_1.env.setFlexUISrc(this._flags['flex-ui-source']);
        }
        // If running in a plugin directory, append it to the names
        if (this.isPluginFolder() && !flexArgs.includes(this.pkg.name)) {
            flexArgs.push('--name', this.pkg.name);
            localPluginNames.push(this.pkg.name);
        }
        if (!localPluginNames.length) {
            throw new flex_dev_utils_1.TwilioCliError('You must run at least one local plugin. To view all remote plugins, go to flex.twilio.com.');
        }
        const flexPort = await this.getPort();
        flexArgs.push('--port', flexPort.toString());
        if (flexArgs.length && localPluginNames.length) {
            // Verify the users environment is ready to run plugins locally
            await this.checkLocalEnvironment(localPluginNames);
            // Verify all plugins are correct
            for (let i = 0; localPluginNames && i < localPluginNames.length; i++) {
                await this.checkPlugin(localPluginNames[i]);
            }
            // Now spawn each plugin as a separate process
            const pluginsConfig = {};
            for (let i = 0; localPluginNames && i < localPluginNames.length; i++) {
                const port = await start_1.findPortAvailablePort('--port', (flexPort + (i + 1) * 100).toString());
                pluginsConfig[localPluginNames[i]] = { port };
            }
            await this.runScript('start', ['flex', ...flexArgs, '--plugin-config', JSON.stringify(pluginsConfig)]);
            for (let i = 0; localPluginNames && i < localPluginNames.length; i++) {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                this.spawnScript('start', [
                    'plugin',
                    '--name',
                    localPluginNames[i],
                    '--port',
                    pluginsConfig[localPluginNames[i]].port.toString(),
                ]);
            }
        }
    }
    /**
     * Checks the plugin
     * @param pluginName  the plugin name
     */
    async checkPlugin(pluginName) {
        const preScriptArgs = ['--name', pluginName];
        if (this.isMultiPlugin()) {
            preScriptArgs.push(`--${MULTI_PLUGINS_PILOT}`);
        }
        await this.runScript('pre-script-check', preScriptArgs);
        await this.runScript('pre-start-check', preScriptArgs);
        // read cli plugins json to get directory
        const plugin = this.pluginsConfig.plugins.find((p) => p.name === pluginName);
        if (!plugin) {
            throw new flex_dev_utils_1.TwilioCliError(`The plugin ${pluginName} was not found.`);
        }
        // Verify plugin's flex-plugin-scripts is v4
        const pkgDir = `${plugin.dir}/package.json`;
        const pkg = fs_1.readJsonFile(pkgDir);
        let scriptVersion = flex_dev_utils_1.semver.coerce(pkg.dependencies['@twilio/flex-plugin-scripts']);
        if (!scriptVersion) {
            scriptVersion = flex_dev_utils_1.semver.coerce(pkg.devDependencies['@twilio/flex-plugin-scripts']);
        }
    }
    /**
     * Checks that the user's environment is ready to run plugins locally
     */
    async checkLocalEnvironment(args) {
        await this.runScript('pre-localrun-check', args);
    }
    /**
     * Checks the plugin version exists
     * @param name the inputted plugin name w/ @ version
     */
    async checkPluginVersionExists(name, version) {
        try {
            await this.pluginVersionsClient.get(name, version);
        }
        catch (e) {
            throw new flex_dev_utils_1.TwilioApiError(20404, `Error finding plugin ${name} at version ${version}`, 404);
        }
    }
    /**
     * Throws an error if user inputted a taken port
     * Returns the port if available
     *
     * @param port
     * @returns
     */
    async getPort() {
        const port = await start_1.findPortAvailablePort('--port', this._flags.port);
        // If port provided, check it is available
        if (this._flags.port !== port && this.argv.includes('--port')) {
            throw new flex_dev_utils_1.TwilioCliError(`Port ${this._flags.port} already in use. Use --port to choose another port.`);
        }
        return port;
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
    get pluginFolderErrorMessage() {
        return `${this.cwd} directory is not a flex plugin directory. You must either run a plugin inside a directory or use the --name flag`;
    }
    /**
     * @override
     */
    getTopicName() {
        return FlexPluginsStart.topicName;
    }
    /**
     * Returns true if we are running multiple plugins
     * @private
     */
    isMultiPlugin() {
        if (this._flags['include-remote']) {
            return true;
        }
        const { name } = this._flags;
        if (!name) {
            return false;
        }
        if (name.length > 1) {
            return true;
        }
        if (this.isPluginFolder()) {
            return this.pkg.name !== name[0];
        }
        return false;
    }
}
exports.default = FlexPluginsStart;
FlexPluginsStart.topicName = 'flex:plugins:start';
FlexPluginsStart.description = general_1.createDescription(FlexPluginsStart.topic.description, false);
FlexPluginsStart.flags = Object.assign(Object.assign({}, baseFlags), { name: command_1.flags.string({
        description: FlexPluginsStart.topic.flags.name,
        multiple: true,
    }), 'include-remote': command_1.flags.boolean({
        description: FlexPluginsStart.topic.flags.includeRemote,
    }), port: command_1.flags.integer({
        description: FlexPluginsStart.topic.flags.port,
        default: 3000,
    }), 'flex-ui-source': command_1.flags.string({
        hidden: true,
    }) });
//# sourceMappingURL=start.js.map