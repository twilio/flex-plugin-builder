const FlexPluginScripts = require('../../../sub-commands/flex-plugin-scripts');

/**
 * Builds the flex-plugin
 */
class FlexPluginsBuild extends FlexPluginScripts {
  async run() {
    await this.runScript('build');
  }

  async runCommand() {
    return this.run();
  }
}

FlexPluginsBuild.description = 'Builds your Flex plugin and creates a JavaScript and sourcemap bundle';

module.exports = FlexPluginsBuild;
