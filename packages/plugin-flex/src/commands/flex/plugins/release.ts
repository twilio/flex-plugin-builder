import { progress } from 'flex-plugins-utils-logger';

import { createDescription } from '../../../utils/general';
import { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
import CreateConfiguration from '../../../sub-commands/create-configuration';

/**
 * Creates a Configuration
 */
export default class FlexPluginsRelease extends CreateConfiguration {
  static description = createDescription('Creates a Flex Plugin Release', true);

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, { strict: false });

    this.scriptArgs = [];
  }

  /**
   * @override
   */
  async doRun() {
    if (this._flags.version && !this._flags.plugin) {
      await this.doCreateRelease(this._flags.version);
    } else {
      const config = await super.doCreateConfiguration();
      await this.doCreateRelease(config.version);
    }
  }

  async doCreateRelease(version: string) {
    await progress(`Enabling configuration **v${version}**`, async () => this.createRelease(version), false);

    this._logger.newline();
    this._logger.success(`🚀 Configuration **v${version}** was successfully enabled`);
    this._logger.newline();
  }

  /**
   * Registers a configuration with Plugins API
   * @returns {Promise}
   */
  async createRelease(version: string) {
    return this.pluginsApiToolkit.release({ version });
  }
}
