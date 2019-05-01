import * as inquirer from 'inquirer';
import { Question } from 'inquirer';
import { FlexPluginArguments } from '../lib/create-flex-plugin';
import { error } from './logging';

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
 * Prompts the user to enter AccountSid
 */
export const _promptForAccountSid = async (): Promise<string> => {
    const question: Question = {
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
    };

    const response = await inquirer.prompt<{ accountSid: string; }> ([question]);

    return response.accountSid;
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
        error('Invalid plugin name. Names need to start with plugin-');
        return process.exit(1);
    }

    if (!_isSidValid('AC', config.accountSid)) {
        config.accountSid = await _promptForAccountSid();
    }

    return config;
};

export default validate;
