import { Configuration } from '@twilio/flex-plugins-api-client';
import { OutputFlags } from '@oclif/parser/lib/parse';
import * as flags from '../../../../utils/flags';
import ArchiveResource from '../../../../sub-commands/archive-resource';
export default class FlexPluginsArchiveConfiguration extends ArchiveResource<Configuration> {
    static topicName: string;
    static description: string;
    static flags: {
        sid: flags.IOptionFlag<string>;
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: import("@oclif/command/lib/flags").IOptionFlag<string>;
    };
    _flags: OutputFlags<typeof FlexPluginsArchiveConfiguration.flags>;
    init(): Promise<void>;
    /**
     * @override
     */
    doArchive(): Promise<Configuration>;
    /**
     * @override
     */
    getName(): string;
    /**
     * @override
     */
    getResourceType(): string;
    /**
     * @override
     */
    getTopicName(): string;
}
