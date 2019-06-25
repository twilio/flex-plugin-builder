import { logger } from 'flex-dev-utils';
import { prompt } from 'flex-dev-utils/dist/inquirer';

import { FlexPluginArguments } from '../lib/create-flex-plugin';

// tslint:disable-next-line
const URL_REGEX = /^(https?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
const GITHUB_REGEX = /github\.com/;

/**
 * Validates the plugin name starts with `plugin-`
 * @param name {string} the plugin name
 * @return {boolean} whether the plugin is valid
 */
export const _isValidPluginName = (name: string): boolean => {
    return /^plugin-\S.*/.test(name);
};

/**
 * Validates sid with the given prefix is valid
 *
 * @param prefix {string}   the prefix of the sid
 * @param sid {string}      the sid to validate
 * @returns {boolean} whether the sid is valid or not
 * @private
 */
export const _isSidValid = (prefix: string, sid: string = ''): boolean => {
    if (!sid) {
        return false;
    }

    const regex = new RegExp(`^${prefix}[0-9a-f]{32}$`);
    return regex.test(sid);
};

/**
 * Validates the string is valid URL
 *
 * @param url {string}  the URL string to validate
 * @return whether the URL is valid
 * @private
 */
export const _isValidUrl = (url: string): boolean => URL_REGEX.test(url);

/**
 * Validates the string is a GitHub URL
 *
 * @param url {string}  the URL string to validate
 * @return whether the URL is GitHub
 * @private
 */
export const _isGitHub = (url: string): boolean => GITHUB_REGEX.test(url);

/**
 * Prompts the user to enter AccountSid
 * @private
 */
export const _promptForAccountSid = async (): Promise<string> => {
    return await prompt({
       type: 'input',
       name: 'accountSid',
       message: 'Twilio Flex Account SID',
       validate: async (input: string) => {
           if (!input.startsWith('AC')) {
               throw new Error('Account SID must start with AC');
           }

           if (!_isSidValid('AC', input)) {
               throw new Error('Account SID is not a valid SID');
           }

           return true;
       },
   });
};

/**
 * Prompts the user to enter template URL
 * @private
 */
export const _promptForTemplateUrl = async (): Promise<string> => {
    return await prompt({
       type: 'input',
       name: 'template',
       message: 'Template URL',
       validate: async (url: string) => {
           if (!_isValidUrl(url)) {
               throw new Error('Please enter a valid URL');
           }

           if (!_isGitHub(url)) {
               throw new Error('Only GitHub URLs are currently supported');
           }

           return true;
       },
   });
};

/**
 * Further validates the configuration
 *
 * @param config {FlexPluginArguments}  the configuration
 * @return {Promise<FlexPluginArguments>}
 */
const validate = async (config: FlexPluginArguments): Promise<FlexPluginArguments>  => {
    config.name = config.name || '';

    if (!_isValidPluginName(config.name)) {
        logger.error('Invalid plugin name. Names need to start with plugin-');
        return process.exit(1);
    }

    if (!_isSidValid('AC', config.accountSid)) {
        config.accountSid = await _promptForAccountSid();
    }

    if (config.template && !_isValidUrl(config.template)) {
        config.template = await _promptForTemplateUrl();
    }

    return config;
};

export default validate;
