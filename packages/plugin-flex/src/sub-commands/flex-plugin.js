const path = require('path');

const { logger } = require('flex-plugins-utils-logger');
const PluginsApiToolkit = require('flex-plugins-api-toolkit').default;
const { TwilioClientCommand } = require('@twilio/cli-core').baseCommands;
const {
  PluginServiceHTTPClient,
  PluginsClient,
  PluginVersionsClient,
  ConfigurationsClient,
} = require('flex-plugins-api-client');
const { TwilioError } = require('flex-plugins-utils-exception');

const fs = require('../utils/fs');

/**
 * Base class for all flex-plugin * scripts.
 * This will ensure the script is running on a Flex-plugin project, otherwise will throw an error
 */
class FlexPlugin extends TwilioClientCommand {
  constructor(argv, config, secureStorage, opts) {
    super(argv, config, secureStorage);

    this.opts = opts || {};
    this.showHeaders = true;
    this.cwd = process.cwd();
    this.scriptArgs = process.argv.slice(3);
    this.skipEnvironmentalSetup = false;
    this._logger = new logger.Logger({ isQuiet: false, markdown: true });

    if (this.opts.strict === false) {
      this.constructor.strict = false;
    }

    this.exit = process.exit;
    process.exit = (exitCode) => {
      if (exitCode === 0) {
        return;
      }

      this.exit(exitCode);
    };
  }

  /**
   * Checks the dir is a Flex plugin
   * @returns {boolean}
   */
  isPluginFolder() {
    return fs.filesExist(path.join(this.cwd, 'public', 'appConfig.js'));
  }

  /**
   * Gets the package.json
   * @returns {object}
   */
  get pkg() {
    return fs.readJSONFile(this.cwd, 'package.json');
  }

  /**
   * The main run command
   * @returns {Promise<void>}
   */
  async run() {
    await super.run();

    if (!this.isPluginFolder()) {
      throw new Error(`${this.cwd} directory is not a flex plugin directory`);
    }

    const httpClient = new PluginServiceHTTPClient(this.twilioClient.username, this.twilioApiClient.password);
    this.pluginsApiToolkit = new PluginsApiToolkit(this.twilioClient.username, this.twilioApiClient.password);
    this.pluginsClient = new PluginsClient(httpClient);
    this.pluginVersionsClient = new PluginVersionsClient(httpClient);
    this.configurationsClient = new ConfigurationsClient(httpClient);

    if (!this.skipEnvironmentalSetup) {
      this.setupEnvironment();
    }

    try {
      this._logger.notice(`Using profile **${this.currentProfile.id}** (${this.currentProfile.accountSid})`);
      this._logger.newline();

      await this.doRun();
    } catch (e) {
      if (e instanceof TwilioError) {
        this._logger.error(e.message);
        this.logger.error(e.message);
      } else {
        this._logger.error('Unexpected error occurred');
        this._logger.info(e);
      }

      this.exit(1);
    }
  }

  /**
   * OClif alias for run command
   */
  /* istanbul ignore next */
  async runCommand() {
    return this.run();
  }

  /**
   * Runs a flex-plugin-scripts script
   * @param scriptName  the script name
   * @param argv        arguments to pass to the script
   */
  /* istanbul ignore next */
  async runScript(scriptName, argv = this.scriptArgs) {
    // eslint-disable-next-line global-require
    return require(`flex-plugin-scripts/dist/scripts/${scriptName}`).default(...argv);
  }

  /**
   * Setups the environment. This must run after run command
   */
  setupEnvironment() {
    process.env.SKIP_CREDENTIALS_SAVING = 'true';
    process.env.TWILIO_ACCOUNT_SID = this.twilioClient.username;
    process.env.TWILIO_AUTH_TOKEN = this.twilioClient.password;
  }

  /**
   * Abstract class method that each command should extend; this is the actual command that runs once initialization is complete
   * @returns {Promise<void>}
   */
  async doRun() {
    throw new Error('Abstract class method must be implemented');
  }
}

module.exports = FlexPlugin;
