const FlexPluginScripts = require('../../../sub-commands/flex-plugin-scripts');
const createDescription = require('../../../utils/general').createDescription;

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

FlexPluginsBuild.description = createDescription('Builds your Flex plugin and creates a JavaScript and sourcemap bundle', true);

module.exports = FlexPluginsBuild;
