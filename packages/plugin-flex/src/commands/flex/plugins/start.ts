import { flags } from '@oclif/command';
import { PluginsConfig, PLUGIN_INPUT_PARSER_REGEX } from '@twilio/flex-plugin-scripts';
import { findPortAvailablePort } from '@twilio/flex-plugin-scripts/dist/scripts/start';
import { FLAG_MULTI_PLUGINS } from '@twilio/flex-plugin-scripts/dist/scripts/pre-script-check';
import { TwilioCliError, semver, env, TwilioApiError } from '@twilio/flex-dev-utils';
import { readJsonFile } from '@twilio/flex-dev-utils/dist/fs';
import { OutputFlags } from '@oclif/parser/lib/parse';

import { createDescription } from '../../../utils/general';
import FlexPlugin, { ConfigData, Pkg, SecureStorage } from '../../../sub-commands/flex-plugin';

const baseFlags = { ...FlexPlugin.flags };
// @ts-ignore
delete baseFlags.json;

const MULTI_PLUGINS_PILOT = FLAG_MULTI_PLUGINS.substring(2);
const NAME_FLAG = '--name';
const PORT_FLAG = '--port';
const INCLUDE_REMOTE_FLAG = 'include-remote';

/**
 * Starts the dev-server for building and iterating on a plugin bundle
 */
export default class FlexPluginsStart extends FlexPlugin {
  static topicName = 'flex:plugins:start';

  static description = createDescription(FlexPluginsStart.topic.description, false);

  static flags = {
    ...baseFlags,
    name: flags.string({
      description: FlexPluginsStart.topic.flags.name,
      multiple: true,
    }),
    'include-remote': flags.boolean({
      description: FlexPluginsStart.topic.flags.includeRemote,
    }),
    port: flags.integer({
      description: FlexPluginsStart.topic.flags.port,
      default: 3000,
    }),
    domain: flags.string({
      description: FlexPluginsStart.topic.flags.domain,
    }),
    'flex-ui-source': flags.string({
      hidden: true,
    }),
  };

  // @ts-ignore
  public _flags: OutputFlags<typeof FlexPluginsStart.flags>;

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, { strict: false, runTelemetryAsync: false });
  }

  async init(): Promise<void> {
    this._flags = (await this.parseCommand(FlexPluginsStart)).flags;
    if (this._flags[INCLUDE_REMOTE_FLAG] || this._flags.name) {
      this.opts.runInDirectory = false;
    }
  }

  /**
   * @override
   */
  async doRun(): Promise<void> {
    const { flexArgs, localPluginNames } = await this.processPluginNames();

    this.setupEnvironmentFlags();
    this.addCurrentPluginIfNeeded(flexArgs, localPluginNames);
    this.validateLocalPlugins(localPluginNames);

    const flexPort = await this.getPort();
    flexArgs.push(PORT_FLAG, flexPort.toString());

    if (flexArgs.length && localPluginNames.length) {
      await this.runPlugins(flexArgs, localPluginNames, flexPort);
    }
  }

  /**
   * Checks the plugin
   * @param pluginName  the plugin name
   */
  async checkPlugin(pluginName: string): Promise<void> {
    const preScriptArgs = [NAME_FLAG, pluginName];
    if (this.isMultiPlugin()) {
      preScriptArgs.push(`--${MULTI_PLUGINS_PILOT}`);
    }
    await this.runScript('pre-script-check', preScriptArgs);
    await this.runScript('pre-start-check', preScriptArgs);

    // read cli plugins json to get directory
    const plugin = this.pluginsConfig.plugins.find((p) => p.name === pluginName);
    if (!plugin) {
      throw new TwilioCliError(`The plugin ${pluginName} was not found.`);
    }

    // Verify plugin's flex-plugin-scripts is v4
    const pkgDir = `${plugin.dir}/package.json`;
    const pkg = readJsonFile<Pkg>(pkgDir);
    let scriptVersion = semver.coerce(pkg.dependencies['@twilio/flex-plugin-scripts']);
    if (!scriptVersion) {
      scriptVersion = semver.coerce(pkg.devDependencies['@twilio/flex-plugin-scripts']);
    }
  }

  /**
   * Checks that the user's environment is ready to run plugins locally
   */
  async checkLocalEnvironment(args: string[]): Promise<void> {
    await this.runScript('pre-localrun-check', args);
  }

  /**
   * Checks the plugin version exists
   * @param name the inputted plugin name w/ @ version
   */
  async checkPluginVersionExists(name: string, version: string): Promise<void> {
    try {
      await this.pluginVersionsClient.get(name, version);
    } catch (e) {
      throw new TwilioApiError(20404, `Error finding plugin ${name} at version ${version}`, 404);
    }
  }

  /**
   * Throws an error if user inputted a taken port
   * Returns the port if available
   *
   * @param port
   * @returns
   */
  async getPort(): Promise<number> {
    const port = await findPortAvailablePort(PORT_FLAG, this._flags.port);

    // If port provided, check it is available
    if (this._flags.port !== port && this.argv.includes(PORT_FLAG)) {
      throw new TwilioCliError(`Port ${this._flags.port} already in use. Use ${PORT_FLAG} to choose another port.`);
    }

    return port;
  }

  /**
   * @override
   */
  get checkCompatibility(): boolean {
    return true;
  }

  /**
   * @override
   */
  get pluginFolderErrorMessage(): string {
    return `${this.cwd} directory is not a flex plugin directory. You must either run a plugin inside a directory or use the ${NAME_FLAG} flag`;
  }

  /**
   * @override
   */
  getTopicName(): string {
    return FlexPluginsStart.topicName;
  }

  /**
   * Processes plugin names from flags and returns flex args and local plugin names
   */
  private async processPluginNames(): Promise<{ flexArgs: string[]; localPluginNames: string[] }> {
    const flexArgs: string[] = [];
    const localPluginNames: string[] = [];

    if (this._flags.name) {
      for (const name of this._flags.name) {
        flexArgs.push(NAME_FLAG, name);

        const groups = name.match(PLUGIN_INPUT_PARSER_REGEX);
        if (!groups) {
          throw new TwilioCliError('Unexpected plugin format was provided.');
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

        if (!semver.valid(version)) {
          throw new TwilioCliError(`Version ${version} is not a valid semver string.`);
        }
        await this.checkPluginVersionExists(pluginName, version);
      }
    }

    return { flexArgs, localPluginNames };
  }

  /**
   * Sets up environment flags
   */
  private setupEnvironmentFlags(): void {
    if (this._flags['flex-ui-source']) {
      env.setFlexUISrc(this._flags['flex-ui-source']);
    }

    if (this._flags.domain) {
      const customDomain = this._flags.domain;
      env.setDomain(customDomain);
    }
  }

  /**
   * Adds current plugin to the list if running in a plugin directory
   */
  private addCurrentPluginIfNeeded(flexArgs: string[], localPluginNames: string[]): void {
    if (this.isPluginFolder() && !flexArgs.includes(this.pkg.name)) {
      flexArgs.push(NAME_FLAG, this.pkg.name);
      localPluginNames.push(this.pkg.name);
    }

    if (this._flags[INCLUDE_REMOTE_FLAG]) {
      flexArgs.push('--include-remote');
    }
  }

  /**
   * Validates that we have at least one local plugin
   */
  private validateLocalPlugins(localPluginNames: string[]): void {
    if (!localPluginNames.length) {
      throw new TwilioCliError(
        'You must run at least one local plugin. To view all remote plugins, go to flex.twilio.com.',
      );
    }
  }

  /**
   * Runs the plugins with the given configuration
   */
  private async runPlugins(flexArgs: string[], localPluginNames: string[], flexPort: number): Promise<void> {
    // Verify the users environment is ready to run plugins locally
    await this.checkLocalEnvironment(localPluginNames);

    // Verify all plugins are correct
    for (let i = 0; localPluginNames && i < localPluginNames.length; i++) {
      await this.checkPlugin(localPluginNames[i]);
    }

    // Now spawn each plugin as a separate process
    const pluginsConfig: PluginsConfig = {};
    for (let i = 0; localPluginNames && i < localPluginNames.length; i++) {
      const port = await findPortAvailablePort(PORT_FLAG, (flexPort + (i + 1) * 100).toString());
      pluginsConfig[localPluginNames[i]] = { port };
    }

    await this.runScript('start', ['flex', ...flexArgs, '--plugin-config', JSON.stringify(pluginsConfig)]);

    for (let i = 0; localPluginNames && i < localPluginNames.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.spawnScript('start', [
        'plugin',
        NAME_FLAG,
        localPluginNames[i],
        PORT_FLAG,
        pluginsConfig[localPluginNames[i]].port.toString(),
      ]);
    }
  }

  /**
   * Returns true if we are running multiple plugins
   * @private
   */
  private isMultiPlugin(): boolean {
    if (this._flags[INCLUDE_REMOTE_FLAG]) {
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
