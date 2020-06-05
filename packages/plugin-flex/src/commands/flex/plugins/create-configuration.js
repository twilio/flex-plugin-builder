const { flags } = require('@oclif/command');
const semver = require('semver');
const { progress } = require('flex-plugins-utils-logger');

const FlexPlugin = require('../../../sub-commands/flex-plugin');
const { createDescription } = require('../../../utils/general');
const { TwilioCliError } = require('../../../exceptions');

/**
 * Creates a Configuration
 */
class FlexPluginsCreateConfiguration extends FlexPlugin {
  constructor(argv, config, secureStorage) {
    super(argv, config, secureStorage, { strict: false });

    this.scriptArgs = [];
  }

  /**
   * Main method
   */
  async doRun() {
    const config = await this.doCreateConfiguration();

    this._logger.newline();
    this._logger.success(`🚀 Configuration **v${config.version}** was successfully created`);
    this._logger.newline();

    this._logger.info('**Next Steps:**');
    this._logger.info(
      `Run {{$ twilio flex:plugins:release --version ${config.version}}} to enable this configuration on your Flex instance`,
    );
    this._logger.newline();
  }

  /**
   * Performs the actual task of validating and creating configuration. This method is also usd by release script.
   * @returns {Promise<T>}
   */
  async doCreateConfiguration() {
    const version = await progress('Validating configuration', async () => this.validateVersion(), false);
    return progress(`Creating configuration **v${version}**`, async () => this.createConfiguration(version), false);
  }

  /**
   * Validates that the provided next plugin version is valid
   * @returns {Promise<void>}
   */
  async validateVersion() {
    const configuration = await this.configurationsClient.latest();
    const currentVersion = (configuration && configuration.version) || '0.0.0';
    const nextVersion = this.flags.version || semver.inc(currentVersion, this.bumpLevel);
    if (!semver.valid(nextVersion)) {
      throw new TwilioCliError(`${nextVersion} is not a valid semver`);
    }
    if (!semver.gt(nextVersion, currentVersion)) {
      throw new TwilioCliError(`The provided version ${nextVersion} must be greater than ${currentVersion}`);
    }

    return nextVersion;
  }

  /**
   * Registers a configuration with Plugins API
   * @returns {Promise}
   */
  async createConfiguration(version) {
    const option = {
      version,
      addPlugins: this.flags.plugin,
      description: this.flags.description || '',
    };
    if (!this.flags.new) {
      option.fromConfiguration = 'active';
    }

    return this.pluginsApiToolkit.createConfiguration(option);
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

FlexPluginsCreateConfiguration.description = createDescription('Creates a Flex Plugin Configuration', true);
FlexPluginsCreateConfiguration.flags = {
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
  new: flags.boolean(),
  plugin: flags.string({
    multiple: true,
    required: true,
    description:
      'The plugin to install, formatted as pluginName@version. Use additional --plugin to provide other plugins to install',
  }),
  description: flags.string({
    description: 'The configuration description',
  }),
};

module.exports = FlexPluginsCreateConfiguration;
