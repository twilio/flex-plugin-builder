import { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
import { createDescription } from '../../../utils/general';
import CreateConfiguration, { CreateConfigurationFlags } from '../../../sub-commands/create-configuration';

/**
 * Creates a Configuration
 */
export default class FlexPluginsCreateConfiguration extends CreateConfiguration<CreateConfigurationFlags> {
  static description = createDescription('Creates a Flex Plugin Configuration', true);

  static flags = { ...CreateConfigurationFlags };

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
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

  get _flags() {
    return this.parse(FlexPluginsCreateConfiguration).flags;
  }
}
