import { flags } from '@oclif/command';
import { findPortAvailablePort, StartScript } from 'flex-plugin-scripts/dist/scripts/start';
import { FLAG_MULTI_PLUGINS } from 'flex-plugin-scripts/dist/scripts/pre-script-check';
import { TwilioCliError, semver, env } from 'flex-dev-utils';
import { readJsonFile } from 'flex-dev-utils/dist/fs';
import { OutputFlags } from '@oclif/parser/lib/parse';
import { PluginConfig } from 'flex-plugin-scripts/src/scripts/start';

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

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, { strict: false });

    if (this._flags['include-remote'] || this._flags.name) {
      this.opts.runInDirectory = false;
    }
  }

  /**
   * @override
   */
  async doRun(): Promise<void> {
    const flexArgs: string[] = [];
    const pluginNames: string[] = [];

    if (this._flags.name) {
      for (const name of this._flags.name) {
        flexArgs.push('--name', name);
        if (!name.includes('@remote')) {
          pluginNames.push(name);
        }
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
      pluginNames.push(this.pkg.name);
    }

    if (!pluginNames.length) {
      throw new TwilioCliError(
        'You must run at least one local plugin. To view all remote plugins, go to flex.twilio.com.',
      );
    }

    flexArgs.push('--port', this._flags.port);

    if (flexArgs.length && pluginNames.length) {
      // Verify all plugins are correct
      for (let i = 0; pluginNames && i < pluginNames.length; i++) {
        await this.checkPlugin(pluginNames[i]);
      }

      // Now spawn each plugin as a separate process
      const pluginConfig: PluginConfig = {};
      for (let i = 0; pluginNames && i < pluginNames.length; i++) {
        const pluginPort = await findPortAvailablePort(
          '--port',
          (parseInt(this._flags.port, 10) + (i + 1) * 100).toString(),
        );
        pluginConfig[pluginNames[i]] = { port: pluginPort };
      }

      await this.runScript('start', ['flex', ...flexArgs, '--plugin-config', JSON.stringify(pluginConfig)]);

      for (let i = 0; pluginNames && i < pluginNames.length; i++) {
        const pluginPort = pluginConfig[pluginNames[i]].port;
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.spawnScript('start', ['plugin', '--name', pluginNames[i], '--port', pluginPort.toString()]);
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
    let scriptVersion = semver.coerce(pkg.dependencies['flex-plugin-scripts']);
    if (!scriptVersion) {
      scriptVersion = semver.coerce(pkg.devDependencies['flex-plugin-scripts']);
    }
  }

  /**
   * Parses the flags passed to this command
   */
  get _flags(): OutputFlags<typeof FlexPluginsStart.flags> {
    return this.parse(FlexPluginsStart).flags;
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
