const FlexPluginScripts = require('../../../sub-commands/flex-plugin-scripts');

/**
 * Deletes the flex-plugin
 */
class FlexPluginsRemove extends FlexPluginScripts {
  async runCommand() {
    await this.runScript('remove');
  }
}

module.exports = FlexPluginsRemove;
