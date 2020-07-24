import { progress } from 'flex-plugins-utils-logger';
import { flags } from '@oclif/command';

import { createDescription } from '../../../utils/general';
import { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
import CreateConfiguration from '../../../sub-commands/create-configuration';

/**
 * Creates a Configuration
 */
export default class FlexPluginsRelease extends CreateConfiguration {
  public static flags = {
    ...CreateConfiguration.flags,
    'configuration-sid': flags.string(),
    plugin: flags.string({
      multiple: true,
      description:
        'The plugin to install, formatted as pluginName@version. Use additional --plugin to provide other plugins to install',
    }),
  };

  static description = createDescription('Creates a Flex Plugin Release', true);

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, { strict: false, runInDirectory: false });

    this.scriptArgs = [];
  }

  /**
   * @override
   */
  async doRun() {
    if (this._flags['configuration-sid'] && !this._flags.plugin) {
      await this.doCreateRelease(this._flags['configuration-sid']);
    } else {
      const config = await super.doCreateConfiguration();
      await this.doCreateRelease(config.sid);
    }
  }

  async doCreateRelease(configurationSid: string) {
    await progress(
      `Enabling configuration **v${configurationSid}**`,
      async () => this.createRelease(configurationSid),
      false,
    );

    this._logger.newline();
    this._logger.success(`🚀 Configuration **${configurationSid}** was successfully enabled`);
    this._logger.newline();
  }

  /**
   * Registers a configuration with Plugins API
   * @returns {Promise}
   */
  async createRelease(configurationSid: string) {
    return this.pluginsApiToolkit.release({ configurationSid });
  }

  get _flags() {
    return this.parse(FlexPluginsRelease).flags;
  }
}
