import { flags } from '@oclif/command';
import { DescribePlugin } from 'flex-plugins-api-toolkit';
import { OutputFlags } from '@oclif/parser/lib/parse';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';
/**
 * Describe the Flex Plugin
 */
export default class FlexPluginsDescribePlugin extends InformationFlexPlugin<DescribePlugin> {
    static topicName: string;
    static description: string;
    static flags: {
        name: flags.IOptionFlag<string>;
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: flags.IOptionFlag<string>;
    };
    /**
     * @override
     */
    getResource(): Promise<DescribePlugin>;
    /**
     * @override
     */
    notFound(): void;
    /**
     * @override
     */
    print(plugin: DescribePlugin): void;
    /**
     * Parses the flags passed to this command
     */
    get _flags(): OutputFlags<typeof FlexPluginsDescribePlugin.flags>;
}
