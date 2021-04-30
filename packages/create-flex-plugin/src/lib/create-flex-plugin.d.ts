import { CLIArguments } from './cli';
export interface FlexPluginArguments extends CLIArguments {
    name: string;
    targetDirectory: string;
    flexSdkVersion: string;
    pluginScriptsVersion: string;
    pluginClassName: string;
    pluginNamespace: string;
}
/**
 * Runs the NPM Installation
 * @param config {FlexPluginArguments}  the configuration
 * @private
 */
export declare const _install: (config: FlexPluginArguments) => Promise<boolean>;
/**
 * Creates all the directories and copies the templates over
 *
 * @param config {FlexPluginArguments}  the configuration
 * @private
 */
export declare const _scaffold: (config: FlexPluginArguments) => Promise<boolean>;
/**
 * Creates a Flex Plugin from the {@link FlexPluginArguments}
 * @param config {FlexPluginArguments} the configuration
 */
export declare const createFlexPlugin: (config: FlexPluginArguments) => Promise<void>;
export default createFlexPlugin;
