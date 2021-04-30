import { FlexConfigurationPlugin } from 'flex-dev-utils/dist/fs';
export interface UserInputPlugin {
    name: string;
    remote: boolean;
    version?: string;
}
/**
 * Reads user input to returns the --name plugins
 * --name plugin-test will run plugin-test locally
 * --name p
 * lugin-test@remote will run plugin-test remotely
 * --include-remote will include all remote plugins
 * @param failIfNotFound
 * @param args
 */
export declare const parseUserInputPlugins: (failIfNotFound: boolean, ...args: string[]) => UserInputPlugin[];
/**
 * Finds the first matched local plugin from provided CLI argument
 * @param plugins
 */
export declare const findFirstLocalPlugin: (plugins: UserInputPlugin[]) => FlexConfigurationPlugin | undefined;
