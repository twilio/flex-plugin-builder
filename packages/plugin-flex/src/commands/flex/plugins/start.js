const FlexPluginScripts = require('../../../sub-commands/flex-plugin-scripts');

/**
 * Starts the dev-server for building and iterating on a flex-plugin
 */
class FlexPluginsStart extends FlexPluginScripts {
  async runCommand() {
    await this.runScript('start');
  }
}

module.exports = FlexPluginsStart;
