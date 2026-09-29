import { flags } from '@oclif/command';
import { DescribeRelease } from '@twilio/flex-plugins-api-client';
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
    _flags: OutputFlags<typeof FlexPluginsDescribeRelease.flags>;
    init(): Promise<void>;
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
     * @override
     */
    getTopicName(): string;
}
