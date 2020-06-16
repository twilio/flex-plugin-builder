import { createDescription } from '../../../utils/general';
import FlexPlugin from '../../../sub-commands/flex-plugin';

/**
 * Deletes the flex-plugin
 */
export default class FlexPluginsRemove extends FlexPlugin {
  async run() {
    await super.run();

    await this.runScript('remove');
  }

  async runCommand() {
    return this.run();
  }
}

FlexPluginsRemove.description = createDescription('Removes the Flex plugin', true);
