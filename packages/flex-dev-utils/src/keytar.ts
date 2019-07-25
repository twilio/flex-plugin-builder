import keytar from 'keytar';

import { prompt, choose, Question, inputNotEmpty } from './inquirer';
import logger from './logger';
import { isSidOfType } from './sids';

const SERVICE_NAME = 'com.twilio.flex.plugins.builder';

export interface AuthConfig {
  accountSid: string;
  authToken: string;
}

interface Credential {
  account: string;
  password: string;
}

const accountSidQuestion: Question = {
  type: 'input',
  name: 'accountSid',
  message: 'Twilio Account Sid:',
  validate: async (str: string) => {
    if (!await inputNotEmpty(str)) {
      return false;
    }

    if (!isSidOfType(str, 'AC')) {
      return 'Invalid Account Sid was provided';
    }

    return true;
  },
};

const authTokenQuestion: Question = {
  type: 'password',
  name: 'authToken',
  message: 'Twilio Auth Token:',
  validate: inputNotEmpty,
};

const chooseAccount: Question = {
  type: 'list',
  name: 'account',
  message: 'Select from one of the following API Keys',
};

/**
 * Fetches the API Key/Secret and stores them in keychain.
 * If no credentials exists, then prompts the user to enter the credentials
 */
export const getCredentials = async (): Promise<AuthConfig> => {
  let accountSid;
  let authToken;

  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    if (!isSidOfType(process.env.TWILIO_ACCOUNT_SID, 'AC')) {
      logger.error('AccountSid is not valid.');
      return process.exit(1);
    }

    accountSid = process.env.TWILIO_ACCOUNT_SID;
    authToken = process.env.TWILIO_AUTH_TOKEN;
    await _saveCredential(accountSid, authToken);

    return {accountSid, authToken};
  }

  const credential = await _findCredential();
  if (credential) {
    accountSid = credential.account;
    authToken = credential.password;
    await _saveCredential(accountSid, authToken);

    return {accountSid, authToken};
  }

  accountSid = await prompt(accountSidQuestion);
  authToken = await prompt(authTokenQuestion);

  await _saveCredential(accountSid, authToken);

  return {accountSid, authToken};
};

/**
 * Clears the credentials
 */
export const clearCredentials = async (): Promise<void> => {
  const credentials = await _getService();
  const promises = credentials.map((cred) => keytar.deletePassword(SERVICE_NAME, cred.account));

  await Promise.all(promises);
};

/**
 * Gets the credential service
 * @private
 */
export const _getService = async (): Promise<Credential[]> => {
  if (process.env.CI) {
    return [];
  }

  return await keytar.findCredentials(SERVICE_NAME);
};

/**
 * Finds the credential. If more than one credential exists, then it prompt the user to choose one.
 *
 * @private
 */
export const _findCredential = async (): Promise<Credential | null> => {
  const credentials = await _getService();

  const accounts = credentials
    .map((cred) => cred.account)
    .filter((acc) => acc.substr(0, 2).toLowerCase() === 'ac' && acc.length === 34);

  if (credentials.length === 0) {
    return null;
  }
  if (credentials.length === 1) {
    return credentials[0];
  }
  if (accounts.length === 0) {
    return null;
  }
  if (accounts.length === 1) {
    return credentials.find((cred) => cred.account === accounts[0]) as Credential;
  }

  const selectedAccount = await choose(chooseAccount, accounts);

  return credentials.find((cred) => cred.account === selectedAccount) as Credential;
};

/**
 * Saves the credential
 *
 * @param account   the account name
 * @param password  the password
 * @private
 */
export const _saveCredential = async (account: string, password: string) => {
  // Do not store password on CI builds
  if (!process.env.CI) {
    await keytar.setPassword(SERVICE_NAME, account, password);
  }
};
