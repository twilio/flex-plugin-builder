import { join } from 'path';
import { homedir } from 'os';

import spawn from 'flex-plugins-utils-spawn';
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
import * as Errors from '@oclif/errors';
import mkdirp from 'mkdirp';
import { PluginServiceHttpOption } from 'flex-plugins-api-client/dist/clients/client';
import * as Parser from '@oclif/parser';
import semver from 'semver/preload';

import parser from '../utils/parser';
import * as flags from '../utils/flags';
import { filesExist, readJSONFile, readJsonFile, writeJSONFile } from '../utils/fs';
import { NotImplementedError, TwilioCliError } from '../exceptions';
import { exit, instanceOf } from '../utils/general';
import { toSentenceCase } from '../utils/strings';
import prints from '../prints';
import { flexPlugin as flexPluginDocs } from '../commandDocs.json';
import FlexConfigurationClient, { FlexConfigurationClientOptions } from '../clients/FlexConfigurationClient';
import ServerlessClient from '../clients/ServerlessClient';

interface FlexPluginOption {
  strict: boolean;
  runInDirectory: boolean;
}

export type ConfigData = typeof services.config.ConfigData;
export type SecureStorage = typeof services.secureStorage.SecureStorage;

export interface FlexPluginFlags {
  json: boolean;
  'clear-terminal': boolean;
  region?: string;
}

export interface FlexConfigurationPlugin {
  name: string;
  dir: string;
  port: number;
}

export interface CLIFlexConfiguration {
  plugins: FlexConfigurationPlugin[];
}

interface Pkg {
  name: string;
  version: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
  browserslist?: Record<string, string>;
}

export type PkgCallback = (input: Pkg) => Pkg;

const baseFlag = { ...baseCommands.TwilioClientCommand.flags };
delete baseFlag['cli-output-format'];

/**
 * Base class for all flex-plugin * scripts.
 * This will ensure the script is running on a Flex-plugin project, otherwise will throw an error
 */
export default class FlexPlugin extends baseCommands.TwilioClientCommand {
  static flags = {
    ...baseFlag,
    json: flags.boolean({
      description: flexPluginDocs.flags.json,
    }),
    'clear-terminal': flags.boolean({
      description: flexPluginDocs.flags.clearTerminal,
    }),
    region: flags.enum({
      options: ['dev', 'stage'],
      default: process.env.TWILIO_REGION,
      hidden: true,
    }),
  };

  protected static DATE_FIELDS = ['datecreated', 'dateupdated', 'created', 'updated'];

  protected static ACTIVE_FIELDS = ['active', 'isactive', 'status'];

  protected static ACCESS_FIELDS = ['private', 'isprivate'];

  private static defaultOptions: FlexPluginOption = {
    strict: true,
    runInDirectory: true,
  };

  protected readonly opts: FlexPluginOption;

  protected readonly cwd: string;

  protected readonly pluginRootDir: string;

  protected readonly cliRootDir: string;

  protected readonly skipEnvironmentalSetup: boolean;

  protected readonly version: string;

  protected readonly _logger: Logger;

  protected scriptArgs: string[];

  private _pluginsApiToolkit?: PluginsApiToolkit;

  private _pluginsClient?: PluginsClient;

  private _pluginVersionsClient?: PluginVersionsClient;

  private _configurationsClient?: ConfigurationsClient;

  private _releasesClient?: ReleasesClient;

  private _flexConfigurationClient?: FlexConfigurationClient;

  private _serverlessClient?: ServerlessClient;

  constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage, opts: Partial<FlexPluginOption>) {
    super(argv, config, secureStorage);

    this.opts = { ...FlexPlugin.defaultOptions, ...opts };
    this.showHeaders = true;
    this.cwd = process.cwd();
    this.pluginRootDir = join(__dirname, '../../');
    this.cliRootDir = join(homedir(), '.twilio-cli');
    this.scriptArgs = process.argv.slice(3);
    this.skipEnvironmentalSetup = false;
    this._logger = new Logger({ isQuiet: false, markdown: true });
    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    this.version = require(join(this.pluginRootDir, 'package.json')).version;

    if (!this.opts.strict) {
      // @ts-ignore
      this.constructor.strict = false;
    }

    this.exit = exit;
  }

  /**
   * Returns the version from the package.json if found, otherwise returns undefined
   * @param pkg
   */
  public static getPackageVersion(pkg: string) {
    try {
      // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
      return require(join(pkg, 'package.json')).version;
    } catch (e) {
      return 'undefined';
    }
  }

  /**
   * Returns the formatted header field
   * @param key
   */
  /* istanbul ignore next */
  public static getHeader(key: string) {
    return toSentenceCase(key);
  }

  /**
   * Parses the timestamp
   * @param timestamp
   */
  /* istanbul ignore next */
  public static parseDate(timestamp: string) {
    return dayjs(timestamp).format('MMM DD, YYYY H:mm:ssA');
  }

  /**
   * Returns the formatted value field
   * @param key
   * @param value
   */
  /* istanbul ignore next */
  public static getValue(key: string, value: string | boolean) {
    key = key.toLowerCase();

    if (FlexPlugin.DATE_FIELDS.includes(key)) {
      return `..!!${FlexPlugin.parseDate(value as string)}!!..`;
    }

    if (FlexPlugin.ACTIVE_FIELDS.includes(key)) {
      return value === true ? 'Active' : 'Inactive';
    }
    if (FlexPlugin.ACCESS_FIELDS.includes(key)) {
      return value === true ? 'Private' : 'Public';
    }

    return value as string;
  }

  /**
   * Checks the dir is a Flex plugin
   * @returns {boolean}
   */
  isPluginFolder() {
    if (!filesExist(this.cwd, 'package.json')) {
      return false;
    }
    const { pkg } = this;

    return ['flex-plugin-scripts', '@twilio/flex-ui'].every(
      (dep) => dep in pkg.dependencies || dep in pkg.devDependencies,
    );
  }

  /**
   * Gets the package.json
   * @returns {object}
   */
  get pkg(): Pkg {
    return readJSONFile<Pkg>(this.cwd, 'package.json');
  }

  /**
   * Returns the major version of flex-plugin-scripts of the package
   */
  get builderVersion(): number | null {
    const { pkg } = this;
    const script = pkg.dependencies['flex-plugin-scripts'] || pkg.devDependencies['flex-plugin-scripts'];
    if (!script) {
      return null;
    }

    const version = semver.coerce(script);
    if (!version) {
      return null;
    }

    return version.major;
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
   * Gets an instantiated {@link FlexConfigurationClient}
   * @returns {FlexConfigurationClient}
   */
  get flexConfigurationClient() {
    if (!this._flexConfigurationClient) {
      throw new TwilioCliError('flexConfigurationClient is not initialized yet');
    }

    return this._flexConfigurationClient;
  }

  /**
   * Gets an instantiated {@link ServerlessClient}
   * @returns {ServerlessClient}
   */
  get serverlessClient() {
    if (!this._serverlessClient) {
      throw new TwilioCliError('serverlessClient is not initialized yet');
    }

    return this._serverlessClient;
  }

  /**
   * The main run command
   * @override
   */
  async run() {
    await super.run();
    this.logger.debug(`Using Flex Plugins Config File: ${this.pluginsConfigPath}`);

    if (this._flags['clear-terminal']) {
      this._logger.clearTerminal();
    }

    if (this.opts.runInDirectory) {
      if (!this.isPluginFolder()) {
        throw new TwilioCliError(
          `${this.cwd} directory is not a flex plugin directory. You must either run a plugin inside a directory or use the --name flag`,
        );
      }

      if (this.checkCompatibility && this.builderVersion !== 4) {
        this._prints.flexPlugin.incompatibleVersion(this.pkg.name, this.builderVersion);
        this.exit(1);
      }
    }

    const pluginServiceOptions: PluginServiceHttpOption = {
      caller: 'twilio-cli',
      packages: {
        'flex-plugin-scripts': FlexPlugin.getPackageVersion('flex-plugin-scripts'),
        'flex-plugins-api-utils': FlexPlugin.getPackageVersion('flex-plugins-api-utils'),
        'flex-plugins-api-client': FlexPlugin.getPackageVersion('flex-plugins-api-client'),
        'twilio-cli': FlexPlugin.getPackageVersion('@twilio/cli-core'),
        'twilio-cli-flex-plugin': FlexPlugin.getPackageVersion(this.pluginRootDir),
      },
    };
    const flexConfigOptions: FlexConfigurationClientOptions = {
      accountSid: this.currentProfile.accountSid,
      username: this.twilioApiClient.username,
      password: this.twilioApiClient.password,
    };

    if (this._flags.region) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pluginServiceOptions.realm = this._flags.region as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      flexConfigOptions.realm = this._flags.region as any;
    }

    const httpClient = new PluginServiceHTTPClient(
      this.twilioApiClient.username,
      this.twilioApiClient.password,
      pluginServiceOptions,
    );
    this._pluginsApiToolkit = new PluginsApiToolkit(
      this.twilioApiClient.username,
      this.twilioApiClient.password,
      pluginServiceOptions,
    );
    this._pluginsClient = new PluginsClient(httpClient);
    this._pluginVersionsClient = new PluginVersionsClient(httpClient);
    this._configurationsClient = new ConfigurationsClient(httpClient);
    this._releasesClient = new ReleasesClient(httpClient);
    this._flexConfigurationClient = new FlexConfigurationClient(
      this.twilioClient.flexApi.v1.configuration.get(),
      flexConfigOptions,
    );
    this._serverlessClient = new ServerlessClient(this.twilioClient.serverless.v1.services);

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
   * Catches any thrown exception
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
    const extra = [];
    if (scriptName !== 'test') {
      extra.push('--core-cwd', this.pluginRootDir);
    }

    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    return require(`flex-plugin-scripts/dist/scripts/${scriptName}`).default(...argv, ...extra);
  }

  /**
   * Spawns a script
   * @param scriptName  the script to spawn
   * @param argv arguments to pass to the script
   */
  /* istanbul ignore next */
  async spawnScript(scriptName: string, argv = this.scriptArgs) {
    const scriptPath = require.resolve(`flex-plugin-scripts/dist/scripts/${scriptName}`);
    return spawn('node', [scriptPath, ...argv, '--run-script', '--core-cwd', this.pluginRootDir]);
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
   * Prints pretty an object as a Key:Value pair
   * @param object    the object to print
   * @param ignoreList  the keys in the object to ignore
   */
  /* istanbul ignore next */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  printPretty<O extends { [key: string]: any }>(object: O, ...ignoreList: (keyof O)[]) {
    Object.keys(object)
      .filter((key) => !ignoreList.includes(key))
      .forEach((key) => {
        this._logger.info(`..│.. [[${toSentenceCase(key)}]]: ${FlexPlugin.getValue(key, object[key])}`);
      });
  }

  /**
   * Prints the key/value pair as a main header
   * @param key the key
   * @param value the value
   */
  /* istanbul ignore next */
  printHeader(key: string, value?: string | boolean) {
    if (value === undefined) {
      this._logger.info(`**[[${FlexPlugin.getHeader(key)}:]]**`);
    } else {
      this._logger.info(`**[[${FlexPlugin.getHeader(key)}:]]** ${FlexPlugin.getValue(key, value)}`);
    }
  }

  /**
   * Prints the key/value as a "version" or instance header
   * @param key
   * @param otherKeys
   */
  /* istanbul ignore next */
  printVersion(key: string, ...otherKeys: string[]) {
    if (otherKeys.length) {
      this._logger.info(`**@@${key}@@** ${otherKeys.join('')}`);
    } else {
      this._logger.info(`**@@${key}@@**`);
    }
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
    throw new NotImplementedError();
  }

  /**
   * Requires a check of compatibility
   */
  get checkCompatibility(): boolean {
    return false;
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

  /**
   * Get the cli plugin configuartion
   */
  get pluginsConfig() {
    mkdirp.sync(join(this.cliRootDir, 'flex'));
    if (!filesExist(this.pluginsConfigPath)) {
      writeJSONFile({ plugins: [] }, this.pluginsConfigPath);
    }
    return readJsonFile<CLIFlexConfiguration>(this.pluginsConfigPath);
  }

  /**
   * Returns the pluginsConfigPath
   */
  get pluginsConfigPath() {
    return join(this.cliRootDir, 'flex', 'plugins.json');
  }

  /**
   * Configures the success/error print messages
   */
  get _prints() {
    return prints(this._logger);
  }

  /**
   * The command parse override
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected parse<F, A extends { [name: string]: any }>(
    options?: Parser.Input<F>,
    argv = this.argv,
  ): Parser.Output<F, A> {
    return parser(super.parse)(options, argv);
  }
}
