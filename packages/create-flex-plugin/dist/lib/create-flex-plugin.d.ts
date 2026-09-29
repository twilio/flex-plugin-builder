import { CLIArguments } from './cli';
export interface FlexPluginArguments extends CLIArguments {
    name: string;
    targetDirectory: string;
    flexSdkVersion: string;
    pluginScriptsVersion: string;
    flexPluginVersion: string;
    pluginClassName: string;
    pluginNamespace: string;
    flexui2: boolean;
    flexui1: boolean;
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
 * Keep track for the command using the {@link FlexPluginArguments}
 * @param timeTaken xtime for the command
 * @param config {FlexPluginArguments} the configuration
 */
export declare const track: (timeTaken: number, config: FlexPluginArguments) => void;
/**
 * Creates a Flex Plugin from the {@link FlexPluginArguments}
 * @param config {FlexPluginArguments} the configuration
 */
export declare const createFlexPlugin: (config: FlexPluginArguments) => Promise<void>;
export default createFlexPlugin;
