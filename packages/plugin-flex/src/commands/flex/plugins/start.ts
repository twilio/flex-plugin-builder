import { flags } from '@oclif/command';
import { findPortAvailablePort, StartScript } from 'flex-plugin-scripts/dist/scripts/start';
import semver from 'semver';

import { createDescription } from '../../../utils/general';
import FlexPlugin, { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
import { readJSONFile } from '../../../utils/fs';
import { IncompatibleVersionError, TwilioCliError } from '../../../exceptions';
import { start as startDocs } from '../../../commandDocs.json';

const baseFlags = { ...FlexPlugin.flags };
// @ts-ignore
delete baseFlags.json;

/**
 * Starts the dev-server for building and iterating on a plugin bundle
 */
export default class FlexPluginsStart extends FlexPlugin {
  static description = createDescription(startDocs.description, false);

  static flags = {
    ...baseFlags,
    name: flags.string({
      description: startDocs.flags.name,
      multiple: true,
    }),
    'include-remote': flags.boolean({
      description: startDocs.flags.includeRemote,
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
  async doRun() {
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

    let flexStartScript: StartScript = { port: 3000 };
    if (flexArgs.length && pluginNames.length) {
      // Verify all plugins are correct
      for (let i = 0; pluginNames && i < pluginNames.length; i++) {
        await this.checkPlugin(pluginNames[i]);
      }

      // Start flex start once
      flexStartScript = await this.runScript('start', ['flex', ...flexArgs]);

      // Now spawn each plugin as a separate process
      for (let i = 0; pluginNames && i < pluginNames.length; i++) {
        const port = await findPortAvailablePort('--port', (flexStartScript.port + (i + 1) * 100).toString());
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.spawnScript('start', ['plugin', '--name', pluginNames[i], '--port', port.toString()]);
      }
    }
  }

  /**
   * Checks the plugin
   * @param pluginName  the plugin name
   */
  async checkPlugin(pluginName: string) {
    await this.runScript('pre-script-check', ['--name', pluginName]);
    await this.runScript('pre-start-check', ['--name', pluginName]);

    // read cli plugins json to get directory
    const plugin = this.pluginsConfig.plugins.find((p) => p.name === pluginName);
    if (!plugin) {
      throw new TwilioCliError(`The plugin ${pluginName} was not found.`);
    }

    // Verify plugin's flex-plugin-scripts is v4
    const pkgDir = `${plugin.dir}/package.json`;
    const pkg = readJSONFile(pkgDir);
    let scriptVersion = semver.coerce(pkg.dependencies['flex-plugin-scripts']);
    if (!scriptVersion) {
      scriptVersion = semver.coerce(pkg.devDependencies['flex-plugin-scripts']);
    }

    if (scriptVersion === null || scriptVersion.major !== 4) {
      throw new IncompatibleVersionError(pluginName, scriptVersion?.major);
    }
  }

  /**
   * Parses the flags passed to this command
   */
  get _flags() {
    return this.parse(FlexPluginsStart).flags;
  }
}
