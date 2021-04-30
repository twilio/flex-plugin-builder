import { Plugin } from 'flex-plugins-api-toolkit';
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
    get _flags(): OutputFlags<typeof FlexPluginsArchivePlugin.flags>;
}
