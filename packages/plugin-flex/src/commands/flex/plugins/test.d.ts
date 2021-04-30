import FlexPlugin, { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
/**
 * Builds the the plugin bundle
 */
export default class FlexPluginsTest extends FlexPlugin {
    static topicName: string;
    static description: string;
    static flags: {
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: import("@oclif/command/lib/flags").IOptionFlag<string>;
    };
    constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage);
    /**
     * @override
     */
    doRun(): Promise<void>;
    /**
     * @override
     */
    get checkCompatibility(): boolean;
}
