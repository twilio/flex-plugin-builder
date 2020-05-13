const FlexPluginScripts = require('../../../sub-commands/flex-plugin-scripts');
const { createDescription } = require('../../../utils/general');

/**
 * Deletes the flex-plugin
 */
class FlexPluginsRemove extends FlexPluginScripts {
  async run() {
    await this.runScript('remove');
  }

  async runCommand() {
    return this.run();
  }
}

FlexPluginsRemove.description = createDescription('Removes your Flex plugin', true);

module.exports = FlexPluginsRemove;
