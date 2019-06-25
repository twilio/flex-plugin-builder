import keytar from 'keytar';

import { prompt, Question } from './inquirer';
import logger from './logger';
import { multilineString } from './strings';

const SERVICE_NAME = 'com.twilio.flex.plugins.builder';

export interface AuthConfig {
  apiKey: string;
  apiSecret: string;
}

const apiKeyQuestion: Question = {
  type: 'input',
  name: 'apiKey',
  message: 'Twilio API Key:',
  validate: async (input: string) => {
    return typeof input === 'string' && input.length > 0;
  },
};

const apiSecretQuestion: Question = {
  type: 'password',
  name: 'apiSecret',
  message: 'Twilio API Secret:',
  validate: async (input: string) => {
    return typeof input === 'string' && input.length > 0;
  },
};

/**
 * Warns about having more than one account in the service
 * @param accounts
 * @private
 */
const _moreThanOneAccountWarning = (accounts: string[]) => {
  const items = logger.colors.blue(accounts.join(', '));
  logger.warning(multilineString(
    'You have more than one account stored in the credentials; the following accounts where found:',
    items,
    '',
    'Consider running `flex-plugin clear` to reset the stored credentials.',
    '',
  ));
};

/**
 * Fetches the API Key/Secret and stores them in keychain.
 * If no credentials exists, then prompts the user to enter the credentials
 */
export const getCredentials = async (): Promise<AuthConfig> => {
  const credentials = await getService();

  let apiKey;
  let apiSecret;

  if (process.env.TWILIO_API_KEY) {
    apiKey = process.env.TWILIO_API_KEY;
  } else {
    if (credentials.length > 1) {
      const accounts = credentials.map((cred) => cred.account);
      _moreThanOneAccountWarning(accounts);
    }

    if (credentials.length === 1) {
      apiKey = credentials[0].account;
    } else {
      const input = await prompt<{ apiKey: string }>(apiKeyQuestion);
      apiKey = input.apiKey;
    }
  }

  if (process.env.TWILIO_API_SECRET) {
    apiSecret = process.env.TWILIO_API_SECRET;
  } else {
    if (credentials.length === 1) {
      apiSecret = credentials[0].password;
    } else {
      const input = await prompt<{ apiSecret: string }>(apiSecretQuestion);
      apiSecret = input.apiSecret;
    }
  }

  // Do not store password on CI builds
  if (!process.env.CI) {
    await keytar.setPassword(SERVICE_NAME, apiKey, apiSecret);
  }

  return {
    apiKey,
    apiSecret,
  };
};

/**
 * Clears the credentials
 */
export const clearCredentials = async (): Promise<void> => {
  const credentials = await getService();
  const promises = credentials.map((cred) => keytar.deletePassword(SERVICE_NAME, cred.account));

  await Promise.all(promises);
};

/**
 * Gets the credential service
 */
export const getService = async () => {
  if (process.env.CI) {
    return [];
  }

  return await keytar.findCredentials(SERVICE_NAME);
};
