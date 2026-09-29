import { flags } from '@oclif/command';
import { OutputFlags } from '@oclif/parser/lib/parse';
import { Release } from '@twilio/flex-plugins-api-client';
import { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
import CreateConfiguration from '../../../sub-commands/create-configuration';
/**
 * Creates a Flex Plugin Configuration and releases and sets it to active
 */
export default class FlexPluginsRelease extends CreateConfiguration {
    static topicName: string;
    static description: string;
    static flags: {
        "configuration-sid": flags.IOptionFlag<string | undefined>;
        name: flags.IOptionFlag<string>;
        plugin: flags.IOptionFlag<string[]>;
        "enable-plugin": flags.IOptionFlag<string[]>;
        "disable-plugin": flags.IOptionFlag<string[]>;
        description: flags.IOptionFlag<string>;
        new: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: flags.IOptionFlag<string>;
    };
    _flags: OutputFlags<typeof FlexPluginsRelease.flags>;
    private prints;
    constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage);
    init(): Promise<void>;
    /**
     * @override
     */
    doRun(): Promise<void>;
    doCreateRelease(configurationSid: string): Promise<void>;
    /**
     * Registers a configuration with Plugins API
     * @returns {Promise}
     */
    createRelease(configurationSid: string): Promise<Release>;
    /**
     * @override
     */
    getTopicName(): string;
}
