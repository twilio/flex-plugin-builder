const { TwilioClientCommand } = require('@twilio/cli-core').baseCommands;
const scripts = require('flex-plugin-scripts').default;
const path = require('path');
const fs = require('fs');
const clear = require('clear');

/**
 * Base class for all flex-plugin * scripts.
 * This will ensure the script is running on a Flex-plugin project, otherwise will throw an error
 */
class FlexPluginScripts extends TwilioClientCommand {
  constructor(argv, config, secureStorage) {
    super(argv, config, secureStorage);

    this.showHeaders = true;
    this.cwd = process.cwd();
    this.clear = clear;

    this.clear();

    if (!this.isPluginFolder()) {
      throw new Error(`${this.cwd} directory is not a flex plugin directory`);
    }
  }

  /**
   * Checks the dir is a Flex plugin
   * @returns {boolean}
   */
  isPluginFolder() {
    const appConfigPath = path.join(this.cwd, 'public', 'appConfig.js');

    return fs.existsSync(appConfigPath);
  }

  /**
   * Runs a script
   * @param scriptName  the script name
   */
  async runScript(scriptName) {
    await scripts(scriptName);
  }
}

module.exports = FlexPluginScripts;
