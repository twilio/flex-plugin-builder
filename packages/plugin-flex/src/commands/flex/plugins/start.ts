import { flags } from '@oclif/command';
import { findPortAvailablePort, StartScript } from 'flex-plugin-scripts/dist/scripts/start';
import semver from 'semver';

import { createDescription } from '../../../utils/general';
import FlexPlugin, { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
import { readJSONFile } from '../../../utils/fs';
import { TwilioCliError } from '../../../exceptions';

/**
 * Starts the dev-server for building and iterating on a flex-plugin
 */
export default class FlexPluginsStart extends FlexPlugin {
  static description = createDescription(
    'Starts a dev-server to build the Flex plugin locally. If the --name flag is used at least once, the command does not need to be invoked in a plugin directory. Else, it does.',
    false,
  );

  static flags = {
    ...FlexPlugin.flags,
    name: flags.string({
      multiple: true,
      description:
        'The name of the plugin(s) you would like to run, formatted as pluginName to run locally, or pluginName@remote to run remotely.',
    }),
    'include-remote': flags.boolean({
      description: 'Use this flag to include all remote plugins in your build.',
    }),
  };

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, {});

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

  async checkPlugin(pluginName: string) {
    // read cli plugins json to get directory
    const plugin = this.pluginsConfig.plugins.find((p) => p.name === pluginName);

    if (!plugin) {
      throw new TwilioCliError(`The plugin ${pluginName} was not found.`);
    }

    const pkgDir = `${plugin.dir}/package.json`;
    const pkg = readJSONFile(pkgDir);
    const scriptVersion = semver.coerce(pkg.dependencies['flex-plugin-scripts']);

    if (scriptVersion === null || scriptVersion.major !== 4) {
      throw new TwilioCliError(`The plugin ${pluginName}'s versioning is not compatable with this CLI command.`);
    }

    await this.runScript('check-start', ['--name', pluginName]);
  }

  /**
   * Parses the flags passed to this command
   */
  get _flags() {
    return this.parse(FlexPluginsStart).flags;
  }
}
