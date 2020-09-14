import { createDescription } from '../../../utils/general';
import FlexPlugin from '../../../sub-commands/flex-plugin';
import { test as testDocs } from '../../../commandDocs.json';

/**
 * Builds the the plugin bundle
 */
export default class FlexPluginsTest extends FlexPlugin {
  static description = createDescription(testDocs.description, true);

  /**
   * @override
   */
  async doRun() {
    process.env.PERSIST_TERMINAL = 'true';
    await this.runScript('test', ['--env=jsdom']);
  }
}
