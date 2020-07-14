import FlexPlugin, { ConfigData, SecureStorage } from '../../sub-commands/flex-plugin';

export default class TmpPlugin extends FlexPlugin {
  public constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, { runInDirectory: false });
  }

  async run() {
    this._logger.info(`Directory name is ${__dirname}`);
  }
}
