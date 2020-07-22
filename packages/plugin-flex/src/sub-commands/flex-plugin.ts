import { join } from 'path';

import { Logger } from 'flex-plugins-utils-logger';
import PluginsApiToolkit from 'flex-plugins-api-toolkit';
import { baseCommands, services } from '@twilio/cli-core';
import {
  PluginServiceHTTPClient,
  PluginsClient,
  PluginVersionsClient,
  ConfigurationsClient,
  ReleasesClient,
} from 'flex-plugins-api-client';
import { TwilioError } from 'flex-plugins-utils-exception';
import dayjs from 'dayjs';
import { flags } from '@oclif/parser';
import * as Errors from '@oclif/errors';

import { filesExist, readJSONFile } from '../utils/fs';
import { TwilioCliError } from '../exceptions';
import { instanceOf } from '../utils/general';

interface FlexPluginOption {
  strict: boolean;
  runInDirectory: boolean;
}

export type ConfigData = typeof services.config.ConfigData;
export type SecureStorage = typeof services.secureStorage.SecureStorage;

export interface FlexPluginFlags {
  json: boolean;
}

/**
 * Base class for all flex-plugin * scripts.
 * This will ensure the script is running on a Flex-plugin project, otherwise will throw an error
 */
export default class FlexPlugin extends baseCommands.TwilioClientCommand {
  static flags = {
    json: flags.boolean(),
  };

  private static defaultOptions: FlexPluginOption = {
    strict: false,
    runInDirectory: true,
  };

  protected readonly opts: FlexPluginOption;

  protected readonly cwd: string;

  protected readonly pluginRootDir: string;

  protected readonly skipEnvironmentalSetup: boolean;

  protected readonly _logger: Logger;

  protected scriptArgs: string[];

  private _pluginsApiToolkit?: PluginsApiToolkit;

  private _pluginsClient?: PluginsClient;

  private _pluginVersionsClient?: PluginVersionsClient;

  private _configurationsClient?: ConfigurationsClient;

  private _releasesClient?: ReleasesClient;

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage, opts: Partial<FlexPluginOption>) {
    super(argv, config, secureStorage);

    this.opts = { ...FlexPlugin.defaultOptions, ...opts };
    this.showHeaders = true;
    this.cwd = process.cwd();
    this.pluginRootDir = join(__dirname, '../../');
    this.scriptArgs = process.argv.slice(3);
    this.skipEnvironmentalSetup = false;
    this._logger = new Logger({ isQuiet: false, markdown: true });

    if (!this.opts.strict) {
      // @ts-ignore
      this.constructor.strict = false;
    }

    this.exit = process.exit;
    // @ts-ignore
    process.exit = (exitCode) => {
      this.exit(exitCode);
    };
  }

  /**
   * Checks the dir is a Flex plugin
   * @returns {boolean}
   */
  isPluginFolder() {
    return filesExist(join(this.cwd, 'public', 'appConfig.js'));
  }

  /**
   * Gets the package.json
   * @returns {object}
   */
  get pkg() {
    return readJSONFile(this.cwd, 'package.json');
  }

  /**
   * Gets an instantiated {@link PluginsApiToolkit}
   * @returns {PluginsApiToolkit}
   */
  get pluginsApiToolkit() {
    if (!this._pluginsApiToolkit) {
      throw new TwilioCliError('PluginsApiToolkit is not initialized yet');
    }

    return this._pluginsApiToolkit;
  }

  /**
   * Gets an instantiated {@link PluginsClient}
   * @returns {PluginsClient}
   */
  get pluginsClient() {
    if (!this._pluginsClient) {
      throw new TwilioCliError('PluginsClient is not initialized yet');
    }

    return this._pluginsClient;
  }

  /**
   * Gets an instantiated {@link PluginsClient}
   * @returns {PluginsClient}
   */
  get pluginVersionsClient() {
    if (!this._pluginVersionsClient) {
      throw new TwilioCliError('PluginVersionsClient is not initialized yet');
    }

    return this._pluginVersionsClient;
  }

  /**
   * Gets an instantiated {@link ConfigurationsClient}
   * @returns {ConfigurationsClient}
   */
  get configurationsClient() {
    if (!this._configurationsClient) {
      throw new TwilioCliError('ConfigurationsClient is not initialized yet');
    }

    return this._configurationsClient;
  }

  /**
   * Gets an instantiated {@link ReleasesClient}
   * @returns {ReleasesClient}
   */
  get releasesClient() {
    if (!this._releasesClient) {
      throw new TwilioCliError('ReleasesClient is not initialized yet');
    }

    return this._releasesClient;
  }

  /**
   * The main run command
   * @override
   */
  async run() {
    await super.run();

    if (this.opts.runInDirectory && !this.isPluginFolder()) {
      throw new TwilioCliError(`${this.cwd} directory is not a flex plugin directory.`);
    }

    const httpClient = new PluginServiceHTTPClient(this.twilioApiClient.username, this.twilioApiClient.password);
    this._pluginsApiToolkit = new PluginsApiToolkit(this.twilioApiClient.username, this.twilioApiClient.password);
    this._pluginsClient = new PluginsClient(httpClient);
    this._pluginVersionsClient = new PluginVersionsClient(httpClient);
    this._configurationsClient = new ConfigurationsClient(httpClient);
    this._releasesClient = new ReleasesClient(httpClient);

    if (!this.skipEnvironmentalSetup) {
      this.setupEnvironment();
    }

    if (!this.isJson) {
      this._logger.notice(`Using profile **${this.currentProfile.id}** (${this.currentProfile.accountSid})`);
      this._logger.newline();
    }

    const result = await this.doRun();
    if (result && this.isJson && typeof result === 'object') {
      this._logger.info(JSON.stringify(result));
    }
  }

  /**
   * Cathes any thrown exception
   * @param error
   */
  async catch(error: Error) {
    if (instanceOf(error, TwilioError)) {
      this._logger.error(error.message);
    } else if (instanceOf(error, Errors.CLIError)) {
      Errors.error(error.message);
    } else {
      super.catch(error);
    }
  }

  /**
   * OClif alias for run command
   * @alias for run
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
  async runScript(scriptName: string, argv = this.scriptArgs) {
    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    return require(`flex-plugin-scripts/dist/scripts/${scriptName}`).default(...argv, '--core-cwd', this.pluginRootDir);
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
   * Parses the timestamp
   * @param timestamp
   */
  /* istanbul ignore next */
  parseDate(timestamp: string) {
    return dayjs(timestamp).format('MMM DD, YYYY H:mm:ssA');
  }

  /**
   * Abstract class method that each command should extend; this is the actual command that runs once initialization is
   * complete
   * @abstract
   * @returns {Promise<void>}
   */
  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async doRun(): Promise<any | void> {
    throw new TwilioCliError('Abstract method must be implemented');
  }

  /**
   * Abstract method for getting the flags
   * @protected
   */
  get _flags(): FlexPluginFlags {
    return this.parse(FlexPlugin).flags;
  }

  /**
   * Whether this is a JSON response
   */
  get isJson() {
    return this._flags.json;
  }
}
