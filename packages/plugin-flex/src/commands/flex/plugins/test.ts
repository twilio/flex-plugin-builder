import { createDescription } from '../../../utils/general';
import FlexPlugin from '../../../sub-commands/flex-plugin';
import { test as testDocs } from '../../../commandDocs.json';
import { IncompatibleVersionError } from '../../../exceptions';

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

  /**
   * @override
   */
  async doRun() {
    if (this.builderVersion !== 4) {
      throw new IncompatibleVersionError(this.pkg.name, this.builderVersion);
    }

    process.env.PERSIST_TERMINAL = 'true';
    await this.runScript('pre-script-check');
    await this.runScript('test', ['--env=jsdom']);
  }
}
