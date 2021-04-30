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
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: flags.IOptionFlag<string>;
    };
    constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage);
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
     * Parses the flags passed to this command
     */
    get _flags(): OutputFlags<typeof FlexPluginsStart.flags>;
    /**
     * @override
     */
    get checkCompatibility(): boolean;
    /**
     * Returns true if we are running multiple plugins
     * @private
     */
    private isMultiPlugin;
}
