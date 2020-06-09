import { FlexPluginError } from './errors';
import { logger } from './index';
import { prompt, choose, Question } from './inquirer';
import { isInputNotEmpty, validateAccountSid, validateApiKey } from './validators';

// Keytar is installed as an optional dependency
// Try to load it here but do not fail if it fails to be required
let keytar: any;
try {
  // tslint:disable-next-line
  keytar = require('keytar');
} catch (e) {
  if (!process.env.CI) {
    logger.debug('Failed to require keytar', e);
  }
}

const SERVICE_NAME = 'com.twilio.flex.plugins.builder';

export interface AuthConfig {
  username: string;
  password: string;
}

interface Credential {
  username: string;
  password: string;
}

interface KeytarCredential {
  account: string;
  password: string;
}

const accountSidQuestion: Question = {
  type: 'input',
  name: 'accountSid',
  message: 'Enter your Twilio Account Sid:',
  validate: validateAccountSid,
};

const authTokenQuestion: Question = {
  type: 'password',
  name: 'authToken',
  message: 'Enter your Twilio Auth Token:',
  validate: isInputNotEmpty,
};

const chooseAccount: Question = {
  type: 'list',
  name: 'account',
  message: 'Choose one of the following Account Sids:',
};

/**
 * Fetches the API Key/Secret and stores them in keychain.
 * If no credentials exists, then prompts the user to enter the credentials
 */
export const getCredential = async (): Promise<AuthConfig> => {
  let username;
  let password;

  const missingCredentials = !((process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) || (process.env.TWILIO_API_KEY && !process.env.TWILIO_API_SECRET));
  if (process.env.CI && missingCredentials) {
    throw new FlexPluginError('❌.  Running script in CI, but no AccountSid/AuthToken or API Key/Secret was provided');
  }

  // If both accountSid/authToken provided, then use that
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    if (!await validateAccountSid(process.env.TWILIO_ACCOUNT_SID)) {
      throw new FlexPluginError('AccountSid is not valid.');
    }

    username = process.env.TWILIO_ACCOUNT_SID;
    password = process.env.TWILIO_AUTH_TOKEN;
  // If both apiKey/secret provided, then use that
  } else if (process.env.TWILIO_API_KEY && process.env.TWILIO_API_SECRET) {
    if (!await validateApiKey(process.env.TWILIO_API_KEY)) {
      throw new FlexPluginError('API Key is not valid.');
    }

    username = process.env.TWILIO_API_KEY;
    password = process.env.TWILIO_API_SECRET;
  } else {
    // Find credential
    const credential = await _findCredential(process.env.TWILIO_ACCOUNT_SID);
    if (credential) {
      username = credential.username;
      password = credential.password;
    }
  }

  // No credentials were found; prompt for it
  if (!username || !password) {
    username = await prompt(accountSidQuestion);
    password = await prompt(authTokenQuestion);
  }

  // Save the credential
  await _saveCredential(username, password);

  return { username, password };
};

/**
 * Clears the credentials
 */
export const clearCredentials = async (): Promise<void> => {
  if (process.env.CI) {
    return Promise.resolve();
  }

  const credentials = await _getService();
  const promises = credentials.map((cred) => _getKeytar().deletePassword(SERVICE_NAME, cred.account));

  await Promise.all(promises);
};

/**
 * Finds the credential. If more than one credential exists, then it prompt the user to choose one.
 *
 * @param accountSid  optional accountSid to find
 * @private
 */
export const _findCredential = async (accountSid?: string): Promise<Credential | null> => {
  const convertCredential = (credential: KeytarCredential): Credential => ({
    username: credential.account,
    password: credential.password,
  });

  const credentials = await _getService();

  if (accountSid) {
    const match = credentials.find((cred) => cred.account === accountSid);
    if (match) {
      return convertCredential(match);
    }
  }

  const accounts = credentials
    .map((cred) => cred.account)
    .filter((acc) => acc.length === 34 && (acc.substr(0, 2) === 'AC' || acc.substr(0, 2) === 'SK'));

  if (credentials.length === 0) {
    return null;
  }
  if (credentials.length === 1) {
    return convertCredential(credentials[0]);
  }
  if (accounts.length === 0) {
    return null;
  }
  /* istanbul ignore next */
  if (accounts.length === 1) {
    return convertCredential(credentials.find((cred) => cred.account === accounts[0]) as KeytarCredential);
  }

  const selectedAccount = await choose(chooseAccount, accounts);

  return convertCredential(credentials.find((cred) => cred.account === selectedAccount) as KeytarCredential);
};

/**
 * Gets the credential service
 * @private
 */
export const _getService = async (): Promise<KeytarCredential[]> => {
  if (process.env.CI) {
    return [];
  }

  return await _getKeytar().findCredentials(SERVICE_NAME);
};

/**
 * Saves the credential
 *
 * @param username   the username
 * @param password  the password
 * @private
 */
export const _saveCredential = async (username: string, password: string) => {
  // Do not store password on CI builds
  if (!process.env.CI && !process.env.SKIP_CREDENTIALS_SAVING) {
    await _getKeytar().setPassword(SERVICE_NAME, username, password);
  }
};

/**
 * Keytar is required optionally and so may not exist.
 * It will throw an error if a local installation is not found.
 *
 * @private
 */
/* istanbul ignore next */
export const _getKeytar = () => {
  if (keytar) {
    return keytar;
  }

  throw new Error('Optional dependency keytar was not installed');
};

export default getCredential;
