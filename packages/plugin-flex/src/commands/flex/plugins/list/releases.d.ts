import { ListReleases } from 'flex-plugins-api-toolkit/dist/scripts';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';
/**
 * Lists the Flex Plugin Releases
 */
export default class FlexPluginsListPlugins extends InformationFlexPlugin<ListReleases[]> {
    static topicName: string;
    static description: string;
    static flags: {
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: import("@oclif/command/lib/flags").IOptionFlag<string>;
    };
    /**
     * @override
     */
    getResource(): Promise<ListReleases[]>;
    /**
     * @override
     */
    notFound(): void;
    /**
     * @override
     */
    print(releases: ListReleases[]): void;
}
