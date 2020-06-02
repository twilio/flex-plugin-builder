const { flags } = require('@oclif/command');
const { progress } = require('flex-plugins-utils-logger');

const FlexPluginsCreateConfiguration = require('./create-configuration');
const { createDescription } = require('../../../utils/general');

/**
 * Creates a Configuration
 */
class FlexPluginsRelease extends FlexPluginsCreateConfiguration {
  constructor(argv, config, secureStorage) {
    super(argv, config, secureStorage, { strict: false });

    this.scriptArgs = [];
  }

  /**
   * Main method
   */
  async doRun() {
    if (this.flags.version && !this.flags.plugin) {
      await this.doCreateRelease(this.flags.version);
    } else {
      const config = await super.doCreateConfiguration();
      await this.doCreateRelease(config.version);
    }
  }

  async doCreateRelease(version) {
    await progress(`Enabling configuration **v${version}**`, async () => this.createRelease(version), false);

    this._logger.newline();
    this._logger.success(`🚀 Your configuration **v${version}** was successfully enabled`);
    this._logger.newline();
  }

  /**
   * Registers a configuration with Plugins API
   * @returns {Promise}
   */
  async createRelease(version) {
    return this.pluginsApiToolkit.release({ version });
  }
}

FlexPluginsRelease.description = createDescription('Creates a Flex Plugin Release', true);
FlexPluginsRelease.flags = {
  version: flags.string(),
  plugin: flags.string({
    multiple: true,
    required: false,
    description: 'The plugin to install formatted as pluginName@version',
  }),
  description: flags.string({
    description: 'The configuration description',
  }),
};

module.exports = FlexPluginsRelease;
