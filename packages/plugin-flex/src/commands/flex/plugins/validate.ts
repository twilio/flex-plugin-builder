import { createDescription } from '../../../utils/general';
import FlexPlugin from '../../../sub-commands/flex-plugin';

const baseFlags = { ...FlexPlugin.flags };
// @ts-ignore
delete baseFlags.json;

/**
 * Validates the plugin
 */
// eslint-disable-next-line import/no-unused-modules
export default class FlexPluginValidate extends FlexPlugin {
  static topicName = 'flex:plugins:validate';

  static description = createDescription(FlexPluginValidate.topic.description, false);

  static flags = {
    ...baseFlags,
  };

  /**
   * @override
   */
  async doRun(): Promise<void> {
    process.env.PERSIST_TERMINAL = 'true';
    await this.runScript('validate');
  }

  /**
   * @override
   */
  get checkCompatibility(): boolean {
    return true;
  }
}
