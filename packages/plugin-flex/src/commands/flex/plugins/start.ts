import { createDescription } from '../../../utils/general';
import FlexPlugin from '../../../sub-commands/flex-plugin';
/**
 * Starts the dev-server for building and iterating on a flex-plugin
 */
export default class FlexPluginsStart extends FlexPlugin {
  static description = createDescription('Starts a dev-server to build your Flex plugin locally', true);

  async doRun() {
    await this.runScript('start');
  }
}
