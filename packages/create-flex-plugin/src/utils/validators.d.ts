import { FlexPluginArguments } from '../lib/create-flex-plugin';
/**
 * Prompts the user to enter AccountSid
 * @private
 */
export declare const _promptForAccountSid: () => Promise<string>;
/**
 * Prompts the user to enter template URL
 * @private
 */
export declare const _promptForTemplateUrl: () => Promise<string>;
/**
 * Further validates the configuration
 *
 * @param config {FlexPluginArguments}  the configuration
 * @return {Promise<FlexPluginArguments>}
 */
declare const validate: (config: FlexPluginArguments) => Promise<FlexPluginArguments>;
export default validate;
