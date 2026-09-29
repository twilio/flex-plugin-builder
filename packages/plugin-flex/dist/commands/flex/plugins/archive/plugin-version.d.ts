import { PluginVersion } from '@twilio/flex-plugins-api-client';
import { OutputFlags } from '@oclif/parser/lib/parse';
import { BuildInstance } from 'twilio/lib/rest/serverless/v1/service/build';
import * as flags from '../../../../utils/flags';
import ArchiveResource from '../../../../sub-commands/archive-resource';
export default class FlexPluginsArchivePluginVersion extends ArchiveResource<PluginVersion> {
    static topicName: string;
    static description: string;
    static flags: {
        name: flags.IOptionFlag<string>;
        version: flags.IOptionFlag<string>;
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: import("@oclif/command/lib/flags").IOptionFlag<string>;
    };
    _flags: OutputFlags<typeof FlexPluginsArchivePluginVersion.flags>;
    init(): Promise<void>;
    /**
     * @override
     */
    doArchive(): Promise<PluginVersion>;
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
     * Removes the serverless files
     * @param build  the active {@link BuildInstance} to remove the files from
     * @private
     */
    removeServerlessFiles(build: BuildInstance): Promise<void>;
    /**
     * Filters the asset by path
     * @param asset the asset to filter
     * @private
     */
    private filterAssetExists;
    /**
     * Returns the {@link BuildInstance} if found. It will also return undefined if the pluginVersion is not part of this build
     * @private
     */
    private getBuildIfActive;
}
