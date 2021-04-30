import { baseCommands } from '@twilio/cli-core';
import { Options } from 'yargs';
import { ConfigData, SecureStorage } from '../../../sub-commands/flex-plugin';
interface YArgs {
    [key: string]: Options;
}
/**
 * Creates a new Flex plugin
 */
export default class FlexPluginsCreate extends baseCommands.TwilioClientCommand {
    static description: string;
    static flags: {
        [x: string]: Options;
    };
    static args: {
        name: string;
        required: boolean;
        description: string;
    }[];
    constructor(argv: string[], config: ConfigData, secureStorage: SecureStorage);
    /**
     * Converts yArgs to OClif flags
     *
     * @param yargs   the yargs flags
     * @returns the OClif args
     */
    static parseYargs(yargs: YArgs): YArgs;
    /**
     * Converts args to arvg array
     *
     * @param args      the args
     * @returns {Array}
     */
    static toArgv(args: string[]): string[];
    /**
     * Main script to run
     *
     * @returns {Promise<void>}
     */
    run(): Promise<void>;
    runCommand(): Promise<void>;
}
export {};
