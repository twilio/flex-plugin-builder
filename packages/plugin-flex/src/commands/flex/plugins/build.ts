import { createDescription } from '../../../utils/general';
import FlexPlugin from '../../../sub-commands/flex-plugin';

/**
 * Builds the flex-plugin
 */
export default class FlexPluginsBuild extends FlexPlugin {
  static description = createDescription('Builds Flex plugin and creates a JavaScript and sourcemap bundle', true);

  async doRun() {
    await this.runScript('build');
  }
}
