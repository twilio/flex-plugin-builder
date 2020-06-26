import { PluginVersionResource } from 'flex-plugins-api-client/dist/clients/pluginVersions';
import { flags } from '@oclif/command';
import { progress } from 'flex-plugins-utils-logger';
import semver from 'semver';
import { DeployResult } from 'flex-plugin-scripts/dist/scripts/deploy';

import { TwilioCliError } from '../../../exceptions';
import { createDescription } from '../../../utils/general';
import FlexPlugin, { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';

/**
 * Builds and then deploys the Flex plugin
 */
export default class FlexPluginsDeploy extends FlexPlugin {
  static description = createDescription('Builds and deploys Flex plugin to Twilio Assets', true);

  static flags = {
    ...FlexPlugin.flags,
    patch: flags.boolean({
      exclusive: ['minor', 'major', 'version'],
    }),
    minor: flags.boolean({
      exclusive: ['patch', 'major', 'version'],
    }),
    major: flags.boolean({
      exclusive: ['patch', 'minor', 'version'],
    }),
    version: flags.string({
      exclusive: ['patch', 'minor', 'major'],
    }),
    changelog: flags.string(),
    public: flags.boolean(),
  };

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, { strict: false });

    this.scriptArgs = [];
  }

  /**
   * Main method
   */
  async doRun() {
    const args = ['--quiet', '--persist-terminal'];

    await progress('Validating plugin deployment', async () => this.validatePlugin(), false);
    await progress(
      `Compiling a production build of **${this.pkg.name}**`,
      async () => this.runScript('build', args),
      false,
    );
    const deployedData: DeployResult = await progress(
      `Uploading **${this.pkg.name}**`,
      async () => this.runScript('deploy', [...this.scriptArgs, ...args]),
      false,
    );
    await progress(
      `Registering plugin **${this.pkg.name}** with Plugins API`,
      async () => this.registerPlugin(),
      false,
    );
    const pluginVersion: PluginVersionResource = await progress(
      `Registering version **v${deployedData.nextVersion}** with Plugins API`,
      async () => this.registerPluginVersion(deployedData),
      false,
    );
    const availability = pluginVersion.private ? 'private' : 'public';

    this._logger.newline();
    this._logger.success(
      `🚀 Plugin (${availability}) **${this.pkg.name}**@**${deployedData.nextVersion}** was successfully deployed to Plugins API`,
    );
    this._logger.newline();

    this._logger.info('**Next Steps:**');
    this._logger.info(
      `Run {{$ twilio flex:plugins:release --plugin ${this.pkg.name}@${deployedData.nextVersion}}} to enable this plugin on your flex instance`,
    );
    this._logger.newline();
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
    } catch (e) {
      // No-op - no plugin exists yet; we'll create it later.
    }

    const nextVersion = this._flags.version || (semver.inc(currentVersion, this.bumpLevel) as string);
    if (!semver.valid(nextVersion)) {
      throw new TwilioCliError(`${nextVersion} is not a valid semver`);
    }
    if (!semver.gt(nextVersion, currentVersion)) {
      throw new TwilioCliError(`The provided version ${nextVersion} must be greater than ${currentVersion}`);
    }

    // Set the plugin version
    this.scriptArgs.push('version', nextVersion);
    this.scriptArgs.push('--pilot-plugins-api');
    if (this._flags.public) {
      this.scriptArgs.push('--public');
    }
  }

  /**
   * Registers a plugin with Plugins API
   * @returns {Promise}
   */
  async registerPlugin() {
    return this.pluginsClient.upsert({
      UniqueName: this.pkg.name,
      FriendlyName: this.pkg.name,
      Description: this.pkg.description || '',
    });
  }

  /**
   * Registers a Plugin Version
   * @param deployResult
   * @returns {Promise}
   */
  async registerPluginVersion(deployResult: DeployResult) {
    return this.pluginVersionsClient.create(this.pkg.name, {
      Version: deployResult.nextVersion,
      PluginUrl: deployResult.pluginUrl,
      Private: !deployResult.isPublic,
      Changelog: this._flags.changelog || '',
    });
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

  /* istanbul ignore next */
  get _flags() {
    return this.parse(FlexPluginsDeploy).flags;
  }
}

FlexPluginsDeploy.strict = false;
