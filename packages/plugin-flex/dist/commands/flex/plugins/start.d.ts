import { flags } from '@oclif/command';
import { OutputFlags } from '@oclif/parser/lib/parse';
import FlexPlugin, { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
/**
 * Starts the dev-server for building and iterating on a plugin bundle
 */
export default class FlexPluginsStart extends FlexPlugin {
    static topicName: string;
    static description: string;
    static flags: {
        name: flags.IOptionFlag<string[]>;
        'include-remote': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        port: import("@oclif/parser/lib/flags").IOptionFlag<number>;
        'flex-ui-source': flags.IOptionFlag<string | undefined>;
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: flags.IOptionFlag<string>;
    };
    _flags: OutputFlags<typeof FlexPluginsStart.flags>;
    constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage);
    init(): Promise<void>;
    /**
     * @override
     */
    doRun(): Promise<void>;
    /**
     * Checks the plugin
     * @param pluginName  the plugin name
     */
    checkPlugin(pluginName: string): Promise<void>;
    /**
     * Checks that the user's environment is ready to run plugins locally
     */
    checkLocalEnvironment(args: string[]): Promise<void>;
    /**
     * Checks the plugin version exists
     * @param name the inputted plugin name w/ @ version
     */
    checkPluginVersionExists(name: string, version: string): Promise<void>;
    /**
     * Throws an error if user inputted a taken port
     * Returns the port if available
     *
     * @param port
     * @returns
     */
    getPort(): Promise<number>;
    /**
     * @override
     */
    get checkCompatibility(): boolean;
    /**
     * @override
     */
    get pluginFolderErrorMessage(): string;
    /**
     * @override
     */
    getTopicName(): string;
    /**
     * Returns true if we are running multiple plugins
     * @private
     */
    private isMultiPlugin;
}
