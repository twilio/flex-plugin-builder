import { baseCommands, services } from '@twilio/cli-core';
import { PluginsClient, PluginVersionsClient, ConfigurationsClient, ReleasesClient, FlexPluginsAPIToolkit } from '@twilio/flex-plugins-api-client';
import { Logger, Telemetry } from '@twilio/flex-dev-utils';
import { SpawnPromise } from '@twilio/flex-dev-utils/dist/spawn';
import * as Parser from '@oclif/parser';
import FlexConfigurationClient from '../clients/FlexConfigurationClient';
import ServerlessClient from '../clients/ServerlessClient';
import { OclifConfig, OClifTopic } from '../utils';
interface FlexPluginOption {
    strict: boolean;
    runInDirectory: boolean;
    /**
     * If set to `true`, runs the telemetry track method async in a daemon process
     */
    runTelemetryAsync: boolean;
}
export declare type ConfigData = typeof services.config.ConfigData;
export declare type SecureStorage = typeof services.secureStorage.SecureStorage;
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
export declare type PkgCallback = (input: Pkg) => Pkg;
/**
 * Base class for all flex-plugin * scripts.
 * This will ensure the script is running on a Flex-plugin project, otherwise will throw an error
 */
export default class FlexPlugin extends baseCommands.TwilioClientCommand {
    static topicName: string;
    static BUILDER_VERSION: number;
    /**
     * Getter for the topic
     */
    static get topic(): OClifTopic;
    static flags: {
        json: Parser.flags.IBooleanFlag<boolean>;
        'clear-terminal': Parser.flags.IBooleanFlag<boolean>;
        region: import("@oclif/command/lib/flags").IOptionFlag<string>;
    };
    protected static DATE_FIELDS: string[];
    protected static ACTIVE_FIELDS: string[];
    protected static ACCESS_FIELDS: string[];
    protected static DEFAULT_FLEX_UI_VERSION: number;
    private static defaultOptions;
    _flags: FlexPluginFlags;
    protected readonly opts: FlexPluginOption;
    protected readonly cwd: string;
    protected readonly pluginRootDir: string;
    protected readonly cliPkg: Pkg;
    protected readonly cliRootDir: string;
    protected readonly skipEnvironmentalSetup: boolean;
    protected readonly version: string;
    protected readonly _logger: Logger;
    protected scriptArgs: string[];
    protected internalScriptArgs: string[];
    protected _telemetryProperties: Record<string, any>;
    private _pluginsApiToolkit?;
    private _pluginsClient?;
    private _pluginVersionsClient?;
    private _configurationsClient?;
    private _releasesClient?;
    private _flexConfigurationClient?;
    private _serverlessClient?;
    private _telemetry;
    constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage, opts: Partial<FlexPluginOption>);
    /**
     * Returns the version from the package.json if found, otherwise returns undefined
     * @param pkg
     */
    static getPackageVersion(pkg: string): string;
    /**
     * Returns the formatted header field
     * @param key
     */
    static getHeader(key: string): string;
    /**
     * Parses the timestamp
     * @param timestamp
     */
    static parseDate(timestamp: string): string;
    /**
     * Returns the formatted value field
     * @param key
     * @param value
     */
    static getValue(key: string, value: string | boolean): string;
    /**
     * Checks the dir is a Flex plugin
     * @returns {boolean}
     */
    isPluginFolder(): boolean;
    /**
     * Gets the package.json
     * @returns {object}
     */
    get pkg(): Pkg;
    /**
     * Returns the major version of flex-plugin-scripts of the package
     */
    get builderVersion(): number | null;
    /**
     * Gets an instantiated {@link FlexPluginsAPIToolkit}
     * @returns {FlexPluginsAPIToolkit}
     */
    get pluginsApiToolkit(): FlexPluginsAPIToolkit;
    /**
     * Gets an instantiated {@link PluginsClient}
     * @returns {PluginsClient}
     */
    get pluginsClient(): PluginsClient;
    /**
     * Gets an instantiated {@link PluginsClient}
     * @returns {PluginsClient}
     */
    get pluginVersionsClient(): PluginVersionsClient;
    /**
     * Gets an instantiated {@link ConfigurationsClient}
     * @returns {ConfigurationsClient}
     */
    get configurationsClient(): ConfigurationsClient;
    /**
     * Gets an instantiated {@link ReleasesClient}
     * @returns {ReleasesClient}
     */
    get releasesClient(): ReleasesClient;
    /**
     * Gets an instantiated {@link FlexConfigurationClient}
     * @returns {FlexConfigurationClient}
     */
    get flexConfigurationClient(): FlexConfigurationClient;
    /**
     * Gets an instantiated {@link ServerlessClient}
     * @returns {ServerlessClient}
     */
    get serverlessClient(): ServerlessClient;
    /**
     * Gets an instantiated {@link Telemetry}
     * @returns {Telemetry}
     */
    get telemetry(): Telemetry;
    /**
     * Returns the flex-ui version from the plugin
     */
    get flexUIVersion(): number;
    set telemetryProperties(properties: Record<string, any>);
    init(): Promise<void>;
    /**
     * The main run command
     * @override
     */
    run(): Promise<void>;
    /**
     * Catches any thrown exception
     * @param error
     */
    catch(error: Error): Promise<void>;
    /**
     * OClif alias for run command
     * @alias for run
     */
    runCommand(): Promise<void>;
    /**
     * Runs a flex-plugin-scripts script
     * @param scriptName  the script name
     * @param argv        arguments to pass to the script
     */
    runScript<T>(scriptName: string, argv?: string[]): Promise<T>;
    /**
     * Spawns a script
     * @param scriptName  the script to spawn
     * @param argv arguments to pass to the script
     */
    spawnScript(scriptName: string, argv?: string[]): SpawnPromise;
    /**
     * Setups the environment. This must run after run command
     */
    setupEnvironment(): Promise<void>;
    /**
     * Prints pretty an object as a Key:Value pair
     * @param object    the object to print
     * @param ignoreList  the keys in the object to ignore
     */
    printPretty<O extends {
        [key: string]: any;
    }>(object: O, ...ignoreList: (keyof O)[]): void;
    /**
     * Prints the key/value pair as a main header
     * @param key the key
     * @param value the value
     */
    printHeader(key: string, value?: string | boolean): void;
    /**
     * Prints the key/value as a "version" or instance header
     * @param key
     * @param otherKeys
     */
    printVersion(key: string, ...otherKeys: string[]): void;
    /**
     * Abstract class method that each command should extend; this is the actual command that runs once initialization is
     * complete
     * @abstract
     * @returns {Promise<void>}
     */
    doRun(): Promise<any | void>;
    /**
     * Returns actual topicName
     * @returns {string}
     */
    getTopicName(): string;
    /**
     * Returns the error message text to display when the command is run outside of the plugin folder
     */
    get pluginFolderErrorMessage(): string;
    /**
     * Requires a check of compatibility
     */
    get checkCompatibility(): boolean;
    /**
     * Whether this is a JSON response
     */
    get isJson(): boolean;
    /**
     * Get the cli plugin configuration
     */
    get pluginsConfig(): CLIFlexConfiguration;
    /**
     * Returns the pluginsConfigPath
     */
    get pluginsConfigPath(): string;
    /**
     * Configures the success/error print messages
     */
    get _prints(): {
        upgradePlugin: {
            upgradeNotification: (skip: boolean, version?: string | undefined) => Promise<void>;
            scriptStarted: (version: string) => void;
            upgradeToLatest: () => void;
            scriptSucceeded: (needsInstall: boolean, version: number) => void;
            flexUIUpdateSucceeded: () => void;
            upgradeToFlexUI2: () => void;
            updatePluginUrl: (newline: boolean) => void;
            cannotRemoveCraco: (newline: boolean) => void;
            packageNotFound: (pkg: string) => void;
            notAvailable: (version?: number | undefined) => void;
            warnNotRemoved: (note: string) => void;
            removeLegacyNotification: (pluginName: string, skip: boolean) => Promise<void>;
            noLegacyPluginFound: (pluginName: string) => void;
            removeLegacyPluginSucceeded: (pluginName: string) => void;
            warningPluginNotInAPI: (pluginName: string) => void;
            manualUpgrade: (files: string[]) => void;
        };
        deploy: {
            deploySuccessful: (name: string, availability: string, deployedData: import("@twilio/flex-plugin-scripts/dist/scripts/deploy").DeployResult, profile: string | null) => void;
            warnHasLegacy: () => void;
        };
        release: {
            releaseSuccessful: (configurationSid: string) => void;
        };
        flexPlugin: {
            incompatibleVersion: (name: string, version: number | null) => void;
            openSSLWarning: () => void;
        };
        archiveResource: {
            archivedSuccessfully: (name: string) => void;
            archivedFailed: (name: string) => void;
            alreadyArchived: (name: string, message: string) => void;
        };
    };
    /**
     * Keep tracks of the command
     * @param timeTaken xtime for the command
     * @param properties additional properties for track events
     */
    trackTopic(timeTaken: number, properties: Record<string, any>): void;
    /**
     * The command parse override
     */
    protected parseCommand<F, A extends {
        [name: string]: any;
    }>(options?: Parser.Input<F>, argv?: string[]): Promise<Parser.Output<F, A>>;
    /**
     * Generates the {@link PluginServiceHttpOption} options
     * @private
     */
    private getPluginServiceOptions;
}
export {};
