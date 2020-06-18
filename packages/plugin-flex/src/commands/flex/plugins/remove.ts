import { createDescription } from '../../../utils/general';
import FlexPlugin from '../../../sub-commands/flex-plugin';

/**
 * Deletes the flex-plugin
 */
export default class FlexPluginsRemove extends FlexPlugin {
  static description = createDescription('Removes the Flex plugin', true);

  async doRun() {
    await this.runScript('remove');
  }
}
