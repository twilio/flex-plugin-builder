import { createDescription } from '../../../utils/general';
import FlexPlugin from '../../../sub-commands/flex-plugin';
import { build as buildDocs } from '../../../commandDocs.json';
import { IncompatibleVersionError } from '../../../exceptions';

const baseFlags = { ...FlexPlugin.flags };
// @ts-ignore
delete baseFlags.json;

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
    if (this.builderVersion !== 4) {
      throw new IncompatibleVersionError(this.pkg.name, this.builderVersion);
    }

    process.env.PERSIST_TERMINAL = 'true';
    await this.runScript('pre-script-check');
    await this.runScript('build');
  }

  get _flags() {
    return this.parse(FlexPluginsBuild).flags;
  }
}
