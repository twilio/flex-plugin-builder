import { createDescription } from '../../../utils/general';
import FlexPlugin, { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
import { test as testDocs } from '../../../commandDocs.json';

const baseFlags = { ...FlexPlugin.flags };
// @ts-ignore
delete baseFlags.json;

/**
 * Builds the the plugin bundle
 */
export default class FlexPluginsTest extends FlexPlugin {
  static description = createDescription(testDocs.description, true);

  static flags = {
    ...baseFlags,
  };

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, { strict: false });
  }

  /**
   * @override
   */
  async doRun() {
    process.env.PERSIST_TERMINAL = 'true';
    await this.runScript('pre-script-check');
    await this.runScript('test', ['--env=jsdom']);
  }

  /**
   * @override
   */
  get checkCompatibility(): boolean {
    return true;
  }
}
