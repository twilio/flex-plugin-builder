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
    'flex-ui-source': flags.string({
      hidden: true,
    }),
  };

  // @ts-ignore
  public _flags: OutputFlags<typeof FlexPluginsStart.flags>;

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, { strict: false });
  }

  async init(): Promise<void> {
    this._flags = (await this.parseCommand(FlexPluginsStart)).flags;
    if (this._flags['include-remote'] || this._flags.name) {
      this.opts.runInDirectory = false;
    }
  }

  /**
   * @override
   */
  async doRun(): Promise<void> {
    const flexArgs: string[] = [];
    const localPluginNames: string[] = [];

    if (this._flags.name) {
      for (const name of this._flags.name) {
        flexArgs.push('--name', name);

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

    if (this._flags['include-remote']) {
      flexArgs.push('--include-remote');
    }

    if (this._flags['flex-ui-source']) {
      env.setFlexUISrc(this._flags['flex-ui-source']);
    }

    // If running in a plugin directory, append it to the names
    if (this.isPluginFolder() && !flexArgs.includes(this.pkg.name)) {
      flexArgs.push('--name', this.pkg.name);
      localPluginNames.push(this.pkg.name);
    }

    if (!localPluginNames.length) {
      throw new TwilioCliError(
        'You must run at least one local plugin. To view all remote plugins, go to flex.twilio.com.',
      );
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
      const pluginsConfig: PluginsConfig = {};
      for (let i = 0; localPluginNames && i < localPluginNames.length; i++) {
        const port = await findPortAvailablePort('--port', (flexPort + (i + 1) * 100).toString());
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
  async checkPlugin(pluginName: string): Promise<void> {
    const preScriptArgs = ['--name', pluginName];
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
    const port = await findPortAvailablePort('--port', this._flags.port);

    // If port provided, check it is available
    if (this._flags.port !== port && this.argv.includes('--port')) {
      throw new TwilioCliError(`Port ${this._flags.port} already in use. Use --port to choose another port.`);
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
   * Returns true if we are running multiple plugins
   * @private
   */
  private isMultiPlugin(): boolean {
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
