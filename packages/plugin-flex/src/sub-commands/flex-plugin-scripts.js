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
  constructor(argv, config, secureStorage, opts) {
    super(argv, config, secureStorage);

    this.opts = opts || {};
    this.showHeaders = true;
    this.cwd = process.cwd();
    this.clear = clear;

    this.clear();

    if (!this.isPluginFolder()) {
      throw new Error(`${this.cwd} directory is not a flex plugin directory`);
    }

    if (opts.strict === false) {
      this.constructor.strict = false;
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
    const args = process.argv.slice(3);
    args.unshift(scriptName);

    await scripts(...args);
  }
}

module.exports = FlexPluginScripts;
