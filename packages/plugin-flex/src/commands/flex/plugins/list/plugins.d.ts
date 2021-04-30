import { ListPlugins } from 'flex-plugins-api-toolkit/dist/scripts';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';
/**
 * Lists the Flex Plugins
 */
export default class FlexPluginsListPlugins extends InformationFlexPlugin<ListPlugins[]> {
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
    getResource(): Promise<ListPlugins[]>;
    /**
     * @override
     */
    notFound(): void;
    /**
     * @override
     */
    print(plugins: ListPlugins[]): void;
    private _print;
}
