const FlexPluginScripts = require('../../../sub-commands/flex-plugin-scripts');

/**
 * Builds the flex-plugin
 */
class FlexPluginsBuild extends FlexPluginScripts {
  async runCommand() {
    await this.runScript('build');
  }
}

module.exports = FlexPluginsBuild;
