import { ListConfigurations } from 'flex-plugins-api-toolkit/dist/scripts';
import InformationFlexPlugin from '../../../../sub-commands/information-flex-plugin';
/**
 * Lists the Flex Plugin Configurations
 */
export default class FlexPluginsListConfigurations extends InformationFlexPlugin<ListConfigurations[]> {
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
    getResource(): Promise<ListConfigurations[]>;
    /**
     * @override
     */
    notFound(): void;
    /**
     * @override
     */
    print(configurations: ListConfigurations[]): void;
}
