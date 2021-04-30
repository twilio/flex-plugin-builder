import { flags } from '@oclif/command';
import { DescribeRelease } from 'flex-plugins-api-toolkit';
import { OutputFlags } from '@oclif/parser/lib/parse';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';
/**
 * Describes the Flex Plugin Release
 */
export default class FlexPluginsDescribeRelease extends InformationFlexPlugin<DescribeRelease> {
    static topicName: string;
    static description: string;
    static flags: {
        sid: flags.IOptionFlag<string | undefined>;
        active: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: flags.IOptionFlag<string>;
    };
    /**
     * @override
     */
    getResource(): Promise<DescribeRelease>;
    /**
     * @override
     */
    notFound(): void;
    /**
     * @override
     */
    print(release: DescribeRelease): void;
    /**
     * Parses the flags passed to this command
     */
    get _flags(): OutputFlags<typeof FlexPluginsDescribeRelease.flags>;
}
