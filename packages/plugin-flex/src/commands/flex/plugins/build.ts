import { createDescription } from '../../../utils/general';
import FlexPlugin from '../../../sub-commands/flex-plugin';
import { build as buildDocs } from '../../../commandDocs.json';

/**
 * Builds the the plugin bundle
 */
export default class FlexPluginsBuild extends FlexPlugin {
  static description = createDescription(buildDocs.description, true);

  static flags = {
    ...FlexPlugin.flags,
  };

  /**
   * @override
   */
  async doRun() {
    process.env.PERSIST_TERMINAL = 'true';
    await this.runScript('build');
  }

  get _flags() {
    return this.parse(FlexPluginsBuild).flags;
  }
}
