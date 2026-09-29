import { Difference, Diff } from '@twilio/flex-plugins-api-client';
import { OutputFlags } from '@oclif/parser/lib/parse';
import FlexPlugin, { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
declare type Args = {
    [name: string]: any;
};
/**
 * Finds the difference between two Flex Plugin Configuration
 */
export default class FlexPluginsDiff extends FlexPlugin {
    static topicName: string;
    static pluginDiffPrefix: string;
    static description: string;
    static args: ({
        description: string;
        name: string;
        required: boolean;
        parse: (input: string) => string;
        arse?: undefined;
    } | {
        description: string;
        name: string;
        arse: (input: string) => string;
        required?: undefined;
        parse?: undefined;
    })[];
    static flags: {
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: import("@oclif/command/lib/flags").IOptionFlag<string>;
    };
    _flags: OutputFlags<typeof FlexPluginsDiff.flags>;
    _args: Args;
    constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage);
    init(): Promise<void>;
    /**
     * @override
     */
    doRun(): Promise<void>;
    /**
     * Finds the diff
     */
    getDiffs(): Promise<Diff>;
    /**
     * Prints the diff
     * @param diff    the diff to print
     * @param prefix  the prefix to add to each entry
     */
    printDiff<T>(diff: Difference<T>, prefix?: string): void;
    /**
     * @override
     */
    getTopicName(): string;
}
export {};
