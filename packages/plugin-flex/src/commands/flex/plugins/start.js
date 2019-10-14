const FlexPluginScripts = require('../../../sub-commands/flex-plugin-scripts');

/**
 * Starts the dev-server for building and iterating on a flex-plugin
 */
class FlexPluginsStart extends FlexPluginScripts {
  async run() {
    await this.runScript('start');
  }

  async runCommand() {
    return this.run();
  }
}

module.exports = FlexPluginsStart;
