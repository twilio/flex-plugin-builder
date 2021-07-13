import { createDescription } from '../../../utils/general';
import FlexPlugin, { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';

const baseFlags = { ...FlexPlugin.flags };
// @ts-ignore
delete baseFlags.json;

/**
 * Builds the the plugin bundle
 */
export default class FlexPluginsTest extends FlexPlugin {
  static topicName = 'flex:plugins:test';

  static description = createDescription(FlexPluginsTest.topic.description, true);

  static flags = {
    ...baseFlags,
  };

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage) {
    super(argv, config, secureStorage, { strict: false });
  }

  /**
   * @override
   */
  async doRun(): Promise<void> {
    process.env.PERSIST_TERMINAL = 'true';
    await this.runScript('pre-script-check');
    await this.runScript('test', ['--env=jsdom', ...this.internalScriptArgs]);
  }

  /**
   * @override
   */
  get checkCompatibility(): boolean {
    return true;
  }
}
