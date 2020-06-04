const { flags } = require('@oclif/command');
const semver = require('semver');
const { progress, logger } = require('flex-plugins-utils-logger');

const FlexPlugin = require('../../../sub-commands/flex-plugin');
const { createDescription } = require('../../../utils/general');
const { TwilioCliError } = require('../../../exceptions');

/**
 * Builds and then deploys the Flex plugin
 */
class FlexPluginsDeploy extends FlexPlugin {
  constructor(argv, config, secureStorage) {
    super(argv, config, secureStorage, { strict: false });

    this.scriptArgs = [];
  }

  /**
   * Main method
   */
  async doRun() {
    const args = ['--quiet', '--persist-terminal'];

    await progress('Validating plugin deployment', async () => this.validateVersion(), false);
    await progress(
      `Compiling a production build of **${this.pkg.name}**`,
      async () => this.runScript('build', args),
      false,
    );
    const deployedData = await progress(
      `Uploading **${this.pkg.name}**`,
      async () => this.runScript('deploy', [...this.scriptArgs, ...args]),
      false,
    );
    await progress(
      `Registering plugin **${this.pkg.name}** with Plugins API`,
      async () => this.registerPlugin(),
      false,
    );
    const pluginVersion = await progress(
      `Registering version **v${deployedData.nextVersion}** with Plugins API`,
      () => this.registerPluginVersion(deployedData),
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
  async validateVersion() {
    const pluginVersion = await this.pluginVersionsClient.latest(this.pkg.name);
    const currentVersion = (pluginVersion && pluginVersion.version) || '0.0.0';
    const nextVersion = this.flags.version || semver.inc(currentVersion, this.bumpLevel);
    if (!semver.valid(nextVersion)) {
      throw new TwilioCliError(`${nextVersion} is not a valid semver`);
    }
    if (!semver.gt(nextVersion, currentVersion)) {
      throw new TwilioCliError(`The provided version ${nextVersion} must be greater than ${currentVersion}`);
    }

    // Set the plugin version
    this.scriptArgs.push('version', nextVersion);
    this.scriptArgs.push('--pilot-plugins-api');
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
   * @param deployedData
   * @returns {Promise}
   */
  async registerPluginVersion(deployedData) {
    return this.pluginVersionsClient.create(this.pkg.name, {
      Version: deployedData.nextVersion,
      PluginUrl: deployedData.pluginUrl,
      Private: !this.argv.includes('--public'),
      Changelog: this.flags.changelog,
    });
  }

  /**
   * Finds the version bump level
   * @returns {string}
   */
  get bumpLevel() {
    if (this.flags.major) {
      return 'major';
    }

    if (this.flags.minor) {
      return 'minor';
    }

    return 'patch';
  }
}

FlexPluginsDeploy.description = createDescription('Builds and deploys Flex plugin to Twilio Assets', true);
FlexPluginsDeploy.flags = {
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
};

module.exports = FlexPluginsDeploy;
