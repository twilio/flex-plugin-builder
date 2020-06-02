const path = require('path');
const fs = require('fs');

const { logger } = require('flex-plugins-utils-logger');
const PluginsApiToolkit = require('flex-plugins-api-toolkit').default;
const { TwilioClientCommand } = require('@twilio/cli-core').baseCommands;
const clear = require('clear');
const {
  PluginServiceHTTPClient,
  PluginsClient,
  PluginVersionsClient,
  ConfigurationsClient,
} = require('flex-plugins-api-client');
const { TwilioError, TwilioApiError } = require('flex-plugins-utils-exception');

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
    this.clear = clear;
    this.clear();

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
   * Gets the package.json
   * @returns {object}
   */
  get pkg() {
    const pkgPath = path.join(this.cwd, 'package.json');

    return JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  }

  /**
   * The main run command
   * @returns {Promise<void>}
   */
  async run() {
    await super.run();

    const httpClient = new PluginServiceHTTPClient(this.twilioClient.username, this.twilioApiClient.password);
    this.pluginsApiToolkit = new PluginsApiToolkit(this.twilioClient.username, this.twilioApiClient.password);
    this.pluginsClient = new PluginsClient(httpClient);
    this.pluginVersionsClient = new PluginVersionsClient(httpClient);
    this.configurationsClient = new ConfigurationsClient(httpClient);

    if (!this.skipEnvironmentalSetup) {
      this.setupEnvironment();
    }

    try {
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
  async runCommand() {
    return this.run();
  }

  /**
   * Runs a flex-plugin-scripts script
   * @param scriptName  the script name
   * @param argv        arguments to pass to the script
   */
  async runScript(scriptName, argv = this.scriptArgs) {
    // eslint-disable-next-line global-require
    return require(`flex-plugin-scripts/dist/scripts/${scriptName}`).default(...argv);
  }

  /**
   * Setups the environment
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
