import { flags } from '@oclif/command';
import { DescribePluginVersion } from 'flex-plugins-api-toolkit';
import { OutputFlags } from '@oclif/parser/lib/parse';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';
/**
 * Describes Flex Plugin Version
 */
export default class FlexPluginsDescribePluginVersion extends InformationFlexPlugin<DescribePluginVersion> {
    static topicName: string;
    static description: string;
    static flags: {
        name: flags.IOptionFlag<string>;
        version: flags.IOptionFlag<string>;
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: flags.IOptionFlag<string>;
    };
    /**
     * @override
     */
    getResource(): Promise<DescribePluginVersion>;
    /**
     * @override
     */
    notFound(): void;
    /**
     * @override
     */
    print(version: DescribePluginVersion): void;
    /**
     * Parses the flags passed to this command
     */
    get _flags(): OutputFlags<typeof FlexPluginsDescribePluginVersion.flags>;
}
