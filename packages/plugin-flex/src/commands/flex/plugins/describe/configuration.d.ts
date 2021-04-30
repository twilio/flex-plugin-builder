import { flags } from '@oclif/command';
import { DescribeConfiguration } from 'flex-plugins-api-toolkit';
import { OutputFlags } from '@oclif/parser/lib/parse';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';
/**
 * Describes the Flex Plugin Configuration
 */
export default class FlexPluginsDescribeConfiguration extends InformationFlexPlugin<DescribeConfiguration> {
    static topicName: string;
    static description: string;
    static flags: {
        sid: flags.IOptionFlag<string>;
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: flags.IOptionFlag<string>;
    };
    /**
     * @override
     */
    getResource(): Promise<DescribeConfiguration>;
    /**
     * @override
     */
    notFound(): void;
    /**
     * @override
     */
    print(configuration: DescribeConfiguration): void;
    /**
     * Parses the flags passed to this command
     */
    get _flags(): OutputFlags<typeof FlexPluginsDescribeConfiguration.flags>;
}
