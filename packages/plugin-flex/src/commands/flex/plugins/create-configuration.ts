import { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
import { createDescription } from '../../../utils/general';
import CreateConfiguration from '../../../sub-commands/create-configuration';

/**
 * Creates a Configuration
 */
export default class FlexPluginsCreateConfiguration extends CreateConfiguration {
  static description = createDescription('Creates a Flex Plugin Configuration', true);

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, { strict: false });

    this.scriptArgs = [];
  }

  /**
   * @override
   */
  async doRun() {
    const config = await this.doCreateConfiguration();

    this._logger.newline();
    this._logger.success(`🚀 Configuration **${config.sid}** was successfully created`);
    this._logger.newline();

    this._logger.info('**Next Steps:**');
    this._logger.info(
      `Run {{$ twilio flex:plugins:release --configuration-sid ${config.sid}}} to enable this configuration on your Flex instance`,
    );
    this._logger.newline();
  }
}
