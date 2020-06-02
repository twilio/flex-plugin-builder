const FlexPlugin = require('../../../sub-commands/flex-plugin');
const { createDescription } = require('../../../utils/general');

/**
 * Deletes the flex-plugin
 */
class FlexPluginsRemove extends FlexPlugin {
  async run() {
    await super.run();

    await this.runScript('remove');
  }

  async runCommand() {
    return this.run();
  }
}

FlexPluginsRemove.description = createDescription('Removes your Flex plugin', true);

module.exports = FlexPluginsRemove;
