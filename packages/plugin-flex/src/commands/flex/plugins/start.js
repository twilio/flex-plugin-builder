const FlexPluginScripts = require('../../../sub-commands/flex-plugin-scripts');
const { createDescription } = require('../../../utils/general');

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

FlexPluginsStart.description = createDescription('Starts a dev-server to build your Flex plugin locally', true);

module.exports = FlexPluginsStart;
