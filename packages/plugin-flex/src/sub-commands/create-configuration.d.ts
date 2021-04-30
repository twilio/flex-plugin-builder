import { CreateConfiguration as ICreateConfiguration } from 'flex-plugins-api-toolkit';
import * as flags from '../utils/flags';
import FlexPlugin, { FlexPluginFlags } from './flex-plugin';
declare type Multiple = {
    multiple: true;
};
interface CreateConfigurationFlags extends FlexPluginFlags {
    new: boolean;
    name?: string;
    'disable-plugin'?: string[];
    'enable-plugin'?: string[];
    description?: string;
}
/**
 * Creates a Configuration
 */
export default abstract class CreateConfiguration extends FlexPlugin {
    static topicName: string;
    static description: string;
    static nameFlag: {
        description: string;
        default: string;
        required: boolean;
        max: number;
    };
    static enablePluginFlag: Partial<flags.IOptionFlag<string[]>> & Multiple;
    static disablePluginFlag: Partial<flags.IOptionFlag<string[]>> & Multiple;
    static descriptionFlag: {
        description: string;
        default: string;
        required: boolean;
        max: number;
    };
    static aliasEnablePluginFlag: Partial<flags.IOptionFlag<string[]>> & Multiple;
    static flags: {
        new: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        name: flags.IOptionFlag<string>;
        plugin: flags.IOptionFlag<string[]>;
        'enable-plugin': flags.IOptionFlag<string[]>;
        'disable-plugin': flags.IOptionFlag<string[]>;
        description: flags.IOptionFlag<string>;
        json: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        'clear-terminal': import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
        region: import("@oclif/command/lib/flags").IOptionFlag<string>;
    };
    /**
     * Performs the actual task of validating and creating configuration. This method is also usd by release script.
     */
    protected doCreateConfiguration(): Promise<ICreateConfiguration>;
    /**
     * Registers a configuration with Plugins API
     * @returns {Promise}
     */
    private createConfiguration;
    get _flags(): CreateConfigurationFlags;
}
export {};
