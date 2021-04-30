import { FlexPluginArguments } from './create-flex-plugin';
/**
 * Install dependencies
 *
 * @param config {FlexPluginArguments} the plugin argument
 * @return {string} the stdout of the execution
 */
export declare const installDependencies: (config: FlexPluginArguments) => Promise<string>;
/**
 * Appends className to the configuration
 *
 * @param config {FlexPluginArguments}  the plugin configuration
 * @return {FlexPluginArguments} the updated configuration
 */
export declare const setupConfiguration: (config: FlexPluginArguments) => FlexPluginArguments;
/**
 * Downloads content from GitHub
 *
 * @param url {string}                  the GitHub url
 * @param dir {string}                  the temp directory to save the downloaded file to
 */
export declare const downloadFromGitHub: (url: string, dir: string) => Promise<void>;
