import { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
import CreateConfiguration from '../../../sub-commands/create-configuration';
/**
 * Creates a Flex Plugin Configuration
 */
export default class FlexPluginsCreateConfiguration extends CreateConfiguration {
    static topicName: string;
    static description: string;
    static flags: {
        new: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        name: import("../../../utils/flags").IOptionFlag<string>;
        plugin: import("../../../utils/flags").IOptionFlag<string[]>;
        'enable-plugin': import("../../../utils/flags").IOptionFlag<string[]>;
        'disable-plugin': import("../../../utils/flags").IOptionFlag<string[]>;
        description: import("../../../utils/flags").IOptionFlag<string>;
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: import("@oclif/command/lib/flags").IOptionFlag<string>;
    };
    constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage);
    /**
     * @override
     */
    doRun(): Promise<void>;
}
