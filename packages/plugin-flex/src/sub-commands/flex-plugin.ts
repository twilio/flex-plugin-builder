import { join } from 'path';
import { homedir } from 'os';

import {
  checkAFileExists,
  getPaths,
  readJsonFile,
  writeJSONFile,
  addCWDNodeModule,
} from '@twilio/flex-dev-utils/dist/fs';
import { baseCommands, services } from '@twilio/cli-core';
import {
  PluginServiceHTTPClient,
  PluginsClient,
  PluginVersionsClient,
  ConfigurationsClient,
  ReleasesClient,
  FlexPluginsAPIToolkit,
} from '@twilio/flex-plugins-api-client';
import {
  TwilioError,
  Logger,
  NotImplementedError,
  TwilioCliError,
  env,
  semver,
  updateNotifier,
  chalk,
} from '@twilio/flex-dev-utils';
import { spawn, SpawnPromise } from '@twilio/flex-dev-utils/dist/spawn';
import dayjs from 'dayjs';
import * as Errors from '@oclif/errors';
import mkdirp from 'mkdirp';
import { PluginServiceHttpOption } from '@twilio/flex-plugins-api-client/dist/clients/client';
import * as Parser from '@oclif/parser';

import parser from '../utils/parser';
import * as flags from '../utils/flags';
import { exit, instanceOf } from '../utils/general';
import { toSentenceCase } from '../utils/strings';
import prints from '../prints';
import FlexConfigurationClient, { FlexConfigurationClientOptions } from '../clients/FlexConfigurationClient';
import ServerlessClient from '../clients/ServerlessClient';
import { getTopic, OclifConfig, OClifTopic } from '../utils';

interface FlexPluginOption {
  strict: boolean;
  runInDirectory: boolean;
}

const flexPluginScripts = '@twilio/flex-plugin-scripts';

export type ConfigData = typeof services.config.ConfigData;
export type SecureStorage = typeof services.secureStorage.SecureStorage;

export interface FlexPluginFlags {
  json: boolean;
  'clear-terminal': boolean;
  region?: string;
}

interface FlexConfigurationPlugin {
  name: string;
  dir: string;
}

interface CLIFlexConfiguration {
  plugins: FlexConfigurationPlugin[];
}

export interface Pkg {
  name: string;
  version: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
  browserslist?: Record<string, string>;
  oclif?: OclifConfig;
}

export type PkgCallback = (input: Pkg) => Pkg;

const baseFlag = { ...baseCommands.TwilioClientCommand.flags };
delete baseFlag['cli-output-format'];

const packageJsonStr = 'package.json';

/**
 * Base class for all flex-plugin * scripts.
 * This will ensure the script is running on a Flex-plugin project, otherwise will throw an error
 */
export default class FlexPlugin extends baseCommands.TwilioClientCommand {
  static checkForUpdateFrequency = 1000 * 60 * 60 * 24; // daily

  static topicName = 'flex:plugins';

  static BUILDER_VERSION = 6;

  /**
   * Getter for the topic
   */
  public static get topic(): OClifTopic {
    return getTopic(this.topicName || '');
  }

  static flags = {
    ...baseFlag,
    json: flags.boolean({
      description: FlexPlugin.topic.flags.json,
    }),
    'clear-terminal': flags.boolean({
      description: FlexPlugin.topic.flags.clearTerminal,
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

  protected static DEFAULT_FLEX_UI_VERSION = 1;

  private static defaultOptions: FlexPluginOption = {
    strict: true,
    runInDirectory: true,
  };

  // @ts-ignore
  public _flags: FlexPluginFlags;

  protected readonly opts: FlexPluginOption;

  protected readonly cwd: string;

  protected readonly pluginRootDir: string;

  protected readonly cliPkg: Pkg;

  protected readonly cliRootDir: string;

  protected readonly skipEnvironmentalSetup: boolean;

  protected readonly version: string;

  protected readonly _logger: Logger;

  // Contains all the raw flags
  protected scriptArgs: string[];

  // Contains all the flags that are passed after --, i.e. `twilio flex:plugins:foo -- --arg1 --arg2
  protected internalScriptArgs: string[];

  private _pluginsApiToolkit?: FlexPluginsAPIToolkit;

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
    this.skipEnvironmentalSetup = false;
    this._logger = new Logger({ isQuiet: false, markdown: true });
    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    this.cliPkg = require(join(this.pluginRootDir, packageJsonStr));
    this.version = this.cliPkg.version;

    if (!this.opts.strict) {
      // @ts-ignore
      this.constructor.strict = false;
    }

    this.exit = exit;

    const doubleDashIndex = argv.indexOf('--');
    this.internalScriptArgs = doubleDashIndex === -1 ? [] : argv.slice(doubleDashIndex + 1);
    if (doubleDashIndex !== -1) {
      process.argv = process.argv.slice(0, doubleDashIndex);
      this.argv = argv.slice(0, doubleDashIndex);
    }
    // TODO: get rid of scriptArgs and use argv instead
    this.scriptArgs = process.argv.slice(3);
  }

  /**
   * Returns the version from the package.json if found, otherwise returns undefined
   * @param pkg
   */
  public static getPackageVersion(pkg: string): string {
    try {
      // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
      return require(join(pkg, packageJsonStr)).version;
    } catch (e) {
      return 'undefined';
    }
  }

  /**
   * Returns the formatted header field
   * @param key
   */
  /* c8 ignore next */
  public static getHeader(key: string): string {
    return toSentenceCase(key);
  }

  /**
   * Parses the timestamp
   * @param timestamp
   */
  /* c8 ignore next */
  public static parseDate(timestamp: string): string {
    return dayjs(timestamp).format('MMM DD, YYYY H:mm:ssA');
  }

  /**
   * Returns the formatted value field
   * @param key
   * @param value
   */
  /* c8 ignore next */
  public static getValue(key: string, value: string | boolean): string {
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
  isPluginFolder(): boolean {
    if (!checkAFileExists(this.cwd, packageJsonStr)) {
      return false;
    }
    const { pkg } = this;

    return ['@twilio/flex-ui'].every((dep) => dep in pkg.dependencies || dep in pkg.devDependencies);
  }

  /**
   * Gets the package.json
   * @returns {object}
   */
  get pkg(): Pkg {
    const pkg = readJsonFile<Pkg>(this.cwd, packageJsonStr);
    pkg.devDependencies = pkg.devDependencies || {};
    pkg.dependencies = pkg.dependencies || {};

    return pkg;
  }

  /**
   * Returns the major version of flex-plugin-scripts of the package
   */
  get builderVersion(): number | null {
    const { pkg } = this;
    const script =
      pkg.dependencies[flexPluginScripts] ||
      pkg.devDependencies[flexPluginScripts] ||
      pkg.dependencies['flex-plugin-scripts'] ||
      pkg.devDependencies['flex-plugin-scripts'];
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
   * Gets an instantiated {@link FlexPluginsAPIToolkit}
   * @returns {FlexPluginsAPIToolkit}
   */
  get pluginsApiToolkit(): FlexPluginsAPIToolkit {
    if (!this._pluginsApiToolkit) {
      throw new TwilioCliError('PluginsApiToolkit is not initialized yet');
    }

    return this._pluginsApiToolkit;
  }

  /**
   * Gets an instantiated {@link PluginsClient}
   * @returns {PluginsClient}
   */
  get pluginsClient(): PluginsClient {
    if (!this._pluginsClient) {
      throw new TwilioCliError('PluginsClient is not initialized yet');
    }

    return this._pluginsClient;
  }

  /**
   * Gets an instantiated {@link PluginsClient}
   * @returns {PluginsClient}
   */
  get pluginVersionsClient(): PluginVersionsClient {
    if (!this._pluginVersionsClient) {
      throw new TwilioCliError('PluginVersionsClient is not initialized yet');
    }

    return this._pluginVersionsClient;
  }

  /**
   * Gets an instantiated {@link ConfigurationsClient}
   * @returns {ConfigurationsClient}
   */
  get configurationsClient(): ConfigurationsClient {
    if (!this._configurationsClient) {
      throw new TwilioCliError('ConfigurationsClient is not initialized yet');
    }

    return this._configurationsClient;
  }

  /**
   * Gets an instantiated {@link ReleasesClient}
   * @returns {ReleasesClient}
   */
  get releasesClient(): ReleasesClient {
    if (!this._releasesClient) {
      throw new TwilioCliError('ReleasesClient is not initialized yet');
    }

    return this._releasesClient;
  }

  /**
   * Gets an instantiated {@link FlexConfigurationClient}
   * @returns {FlexConfigurationClient}
   */
  get flexConfigurationClient(): FlexConfigurationClient {
    if (!this._flexConfigurationClient) {
      throw new TwilioCliError('flexConfigurationClient is not initialized yet');
    }

    return this._flexConfigurationClient;
  }

  /**
   * Gets an instantiated {@link ServerlessClient}
   * @returns {ServerlessClient}
   */
  get serverlessClient(): ServerlessClient {
    if (!this._serverlessClient) {
      throw new TwilioCliError('serverlessClient is not initialized yet');
    }

    return this._serverlessClient;
  }

  /**
   * Returns the flex-ui version from the plugin
   */
  get flexUIVersion(): number {
    const flexUI = '@twilio/flex-ui';
    const dep = this.pkg.dependencies[flexUI] || this.pkg.devDependencies[flexUI];
    if (!dep) {
      throw new TwilioCliError(`Package '${flexUI}' was not found`);
    }

    return semver.coerce(dep)?.major || FlexPlugin.DEFAULT_FLEX_UI_VERSION;
  }

  async init(): Promise<void> {
    this._flags = (await this.parseCommand(FlexPlugin)).flags;
  }

  /**
   * The main run command
   * @override
   */
  async run(): Promise<void> {
    await super.run();
    this.checkForUpdate();
    addCWDNodeModule();

    if (!this.skipEnvironmentalSetup) {
      await this.setupEnvironment();
    }

    this.logger.debug(`Using Plugins CLI version ${this.cliPkg.version}`);
    this.logger.debug(`Using Flex Plugins Config File: ${this.pluginsConfigPath}`);

    if (this._flags?.['clear-terminal']) {
      this._logger.clearTerminal();
    }

    if (this.opts.runInDirectory) {
      const pluginScriptVersion = FlexPlugin.getPackageVersion(join(this.cwd, 'node_modules', flexPluginScripts));
      this.logger.debug(`Using ${flexPluginScripts} version ${pluginScriptVersion}`);

      if (!this.isPluginFolder()) {
        throw new TwilioCliError(
          `${this.cwd} directory is not a flex plugin directory. You must either run a plugin inside a directory or use the --name flag`,
        );
      }

      if (this.checkCompatibility && this.builderVersion !== FlexPlugin.BUILDER_VERSION) {
        this._prints.flexPlugin.incompatibleVersion(this.pkg.name, this.builderVersion);
        this.exit(1);
      }
    }

    const pluginServiceOptions = this.getPluginServiceOptions();
    const flexConfigOptions: FlexConfigurationClientOptions = {
      accountSid: this.currentProfile.accountSid,
      username: this.twilioApiClient.username,
      password: this.twilioApiClient.password,
    };

    const httpClient = new PluginServiceHTTPClient(
      this.twilioApiClient.username,
      this.twilioApiClient.password,
      pluginServiceOptions,
    );
    this._pluginsApiToolkit = new FlexPluginsAPIToolkit(
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
    this._serverlessClient = new ServerlessClient(this.twilioClient.serverless.v1.services, this._logger);

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
  async catch(error: Error): Promise<void> {
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
  /* c8 ignore next */
  async runCommand(): Promise<void> {
    return this.run();
  }

  /**
   * Runs a flex-plugin-scripts script
   * @param scriptName  the script name
   * @param argv        arguments to pass to the script
   */
  /* c8 ignore next */
  async runScript<T>(scriptName: string, argv = this.scriptArgs): Promise<T> {
    const extra = [];
    if (scriptName !== 'test') {
      extra.push('--core-cwd', this.pluginRootDir);
      env.setCLI();
    }

    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
    return require(`${flexPluginScripts}/dist/scripts/${scriptName}`).default(...argv, ...extra);
  }

  /**
   * Spawns a script
   * @param scriptName  the script to spawn
   * @param argv arguments to pass to the script
   */
  /* c8 ignore next */
  // @ts-ignore
  async spawnScript(scriptName: string, argv = this.scriptArgs): SpawnPromise {
    const scriptPath = require.resolve(`${flexPluginScripts}/dist/scripts/${scriptName}`);
    env.setCLI();
    return spawn('node', [scriptPath, ...argv, '--run-script', '--core-cwd', this.pluginRootDir]);
  }

  /**
   * Setups the environment. This must run after run command
   */
  async setupEnvironment(): Promise<void> {
    process.env.SKIP_CREDENTIALS_SAVING = 'true';
    process.env.TWILIO_ACCOUNT_SID = this.twilioClient.username;
    process.env.TWILIO_AUTH_TOKEN = this.twilioClient.password;
    env.setTwilioProfile(this.currentProfile.id);

    if (this._flags['cli-log-level'] === 'debug') {
      env.setDebug();
      env.persistTerminal();
    }

    if (this._flags.region) {
      env.setRegion(this._flags.region as any);
    } else if (this.currentProfile.region) {
      env.setRegion(this.currentProfile.region);
    }

    const shellCmd = ['npm', 'yarn'];
    for (const cmd of shellCmd) {
      const result = await spawn(cmd, ['-v'], {});
      if (result.exitCode === 0) {
        process.versions[cmd] = result.stdout;
      }
    }
  }

  /**
   * Prints pretty an object as a Key:Value pair
   * @param object    the object to print
   * @param ignoreList  the keys in the object to ignore
   */
  /* c8 ignore next */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  printPretty<O extends { [key: string]: any }>(object: O, ...ignoreList: (keyof O)[]): void {
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
  /* c8 ignore next */
  printHeader(key: string, value?: string | boolean): void {
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
  /* c8 ignore next */
  printVersion(key: string, ...otherKeys: string[]): void {
    if (otherKeys.length) {
      this._logger.info(`**@@${key}@@** ${otherKeys.join('')}`);
    } else {
      this._logger.info(`**@@${key}@@**`);
    }
  }

  /**
   * Checks for CLI update
   */
  /* c8 ignore next */
  checkForUpdate(): void {
    const notifier = updateNotifier({ pkg: this.cliPkg, updateCheckInterval: FlexPlugin.checkForUpdateFrequency });
    // template taken from the update-checker
    const message = `Update available ${chalk.dim(notifier.update?.current)}${chalk.reset(' → ')}${chalk.green(
      notifier.update?.latest,
    )} \nRun ${chalk.cyan('twilio plugins:install @twilio-labs/plugin-flex')} to update`;

    notifier.notify({ message });
  }

  /**
   * Abstract class method that each command should extend; this is the actual command that runs once initialization is
   * complete
   * @abstract
   * @returns {Promise<void>}
   */
  /* c8 ignore next */
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
   * Whether this is a JSON response
   */
  get isJson(): boolean {
    return this._flags.json;
  }

  /**
   * Get the cli plugin configuration
   */
  get pluginsConfig(): CLIFlexConfiguration {
    mkdirp.sync(join(this.cliRootDir, 'flex'));
    if (!checkAFileExists(this.pluginsConfigPath)) {
      writeJSONFile({ plugins: [] }, this.pluginsConfigPath);
    }
    return readJsonFile<CLIFlexConfiguration>(this.pluginsConfigPath);
  }

  /**
   * Returns the pluginsConfigPath
   */
  get pluginsConfigPath(): string {
    return join(this.cliRootDir, 'flex', 'plugins.json');
  }

  /**
   * Configures the success/error print messages
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  get _prints() {
    return prints(this._logger);
  }

  /**
   * The command parse override
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async parseCommand<F, A extends { [name: string]: any }>(
    options?: Parser.Input<F>,
    argv = this.argv,
  ): Promise<Parser.Output<F, A>> {
    return parser(super.parse.bind(this))(options, argv);
  }

  /**
   * Generates the {@link PluginServiceHttpOption} options
   * @private
   */
  private getPluginServiceOptions(): PluginServiceHttpOption {
    const packages = {
      [flexPluginScripts]: FlexPlugin.getPackageVersion(flexPluginScripts),
      cli: FlexPlugin.getPackageVersion('@twilio/cli-core'),
      'twilio-cli-flex-plugin': FlexPlugin.getPackageVersion(this.pluginRootDir),
      react: FlexPlugin.getPackageVersion('react'),
      'react-dom': FlexPlugin.getPackageVersion('react-dom'),
      '@twilio/flex-plugins-api-client': FlexPlugin.getPackageVersion('@twilio/flex-plugins-api-client'),
      'flex-ui': FlexPlugin.getPackageVersion(`@twilio/flex-ui`),
      isTs: 'unknown',
    };
    if (this.opts.runInDirectory) {
      packages.isTs = getPaths().app.isTSProject().toString();
    }

    return {
      setUserAgent: true,
      caller: 'twilio-cli',
      packages,
    };
  }
}
