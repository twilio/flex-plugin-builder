import { Plugin } from '@twilio/flex-plugins-api-client';
import { OutputFlags } from '@oclif/parser/lib/parse';
import * as flags from '../../../../utils/flags';
import ArchiveResource from '../../../../sub-commands/archive-resource';
export default class FlexPluginsArchivePlugin extends ArchiveResource<Plugin> {
    static topicName: string;
    static description: string;
    static flags: {
        name: flags.IOptionFlag<string>;
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: import("@oclif/command/lib/flags").IOptionFlag<string>;
    };
    _flags: OutputFlags<typeof FlexPluginsArchivePlugin.flags>;
    init(): Promise<void>;
    /**
     * @override
     */
    doArchive(): Promise<Plugin>;
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
    /**
     * Archives the resource on flex-plugins-api service
     * @private
     */
    private archiveOnPluginsAPI;
    /**
     * Removes the {@link EnvironmentInstance}
     * @param alreadyArchived whether the resource on plugins-api is already archived or not
     * @private
     */
    removeServerlessEnvironment(alreadyArchived: boolean): Promise<void>;
}
