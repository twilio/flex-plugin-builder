import { Difference } from 'flex-plugins-api-toolkit/dist/tools/diff';
import { Diff } from 'flex-plugins-api-toolkit';
import { OutputFlags } from '@oclif/parser/lib/parse';
import FlexPlugin, { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
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
    constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage);
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
     * Parses the flags passed to this command
     */
    get _flags(): OutputFlags<typeof FlexPluginsDiff.flags>;
    get _args(): {
        [name: string]: any;
    };
}
