import { flags } from '@oclif/parser';
import { OutputFlags } from '@oclif/parser/lib/parse';
import FlexPlugin from '../../../sub-commands/flex-plugin';
export declare type ValidateResult = {
    violations: string[];
    vtime: number;
    error?: {
        message: string;
        timedOut: boolean;
    };
};
/**
 * Validates the plugin
 */
export default class FlexPluginValidate extends FlexPlugin {
    static topicName: string;
    static description: string;
    static flags: {
        'flex-ui-2.0': flags.IBooleanFlag<boolean>;
        json: flags.IBooleanFlag<boolean>;
        'clear-terminal': flags.IBooleanFlag<boolean>;
        region: import("@oclif/command/lib/flags").IOptionFlag<string>;
    };
    _flags: OutputFlags<typeof FlexPluginValidate.flags>;
    init(): Promise<void>;
    /**
     * @override
     */
    doRun(): Promise<void>;
    /**
     * @override
     */
    getTopicName(): string;
    /**
     * @override
     */
    get checkCompatibility(): boolean;
}
