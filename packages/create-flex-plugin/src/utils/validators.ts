import { FlexPluginArguments } from '../lib/create-flex-plugin';
import * as inquirer from 'inquirer';
import { error } from './logging';
import { Question } from 'inquirer';

/**
 * Validates the plugin name starts with `plugin-`
 * @param name {string} the plugin name
 * @return {boolean} whether the plugin is valid
 */
export const _isValidPluginName = (name: string): boolean => {
	return /^plugin-\S.*/.test(name);
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

			if (!/^AC[0-9a-f]{32}$/.test(input)) {
				throw new Error('Account SID is not a valid SID');
			}

			return true;
		}
	};

	const response = await inquirer.prompt<{accountSid: string;}>([question]);

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

	if (!config.accountSid) {
		config.accountSid = await _promptForAccountSid();
	}

	return config;
};

export default validate;
