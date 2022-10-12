import { createDescription } from '../../../utils/general';
import FlexPlugin from '../../../sub-commands/flex-plugin';

const baseFlags = { ...FlexPlugin.flags };
// @ts-ignore
delete baseFlags.json;

/**
 * Builds the the plugin bundle
 */
export default class FlexPluginsBuild extends FlexPlugin {
  static topicName = 'flex:plugins:build';

  static description = createDescription(FlexPluginsBuild.topic.description, true);

  static flags = {
    ...baseFlags,
  };

  /**
   * @override
   */
  async doRun(): Promise<void> {
    process.env.PERSIST_TERMINAL = 'true';
    await this.runScript('pre-script-check');
    await this.runScript('build');
  }

  /**
   * @override
   */
  get checkCompatibility(): boolean {
    return true;
  }
}
