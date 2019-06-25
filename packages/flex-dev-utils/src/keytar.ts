import keytar from 'keytar';

import { prompt, choose, Question, inputNotEmpty } from './inquirer';

const SERVICE_NAME = 'com.twilio.flex.plugins.builder';

export interface AuthConfig {
  apiKey: string;
  apiSecret: string;
}

interface Credential {
  account: string;
  password: string;
}

const apiKeyQuestion: Question = {
  type: 'input',
  name: 'apiKey',
  message: 'Twilio API Key:',
  validate: inputNotEmpty,
};

const apiSecretQuestion: Question = {
  type: 'password',
  name: 'apiSecret',
  message: 'Twilio API Secret:',
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
  let apiKey;
  let apiSecret;

  if (process.env.TWILIO_API_KEY && process.env.TWILIO_API_SECRET) {
    apiKey = process.env.TWILIO_API_KEY;
    apiSecret = process.env.TWILIO_API_SECRET;
    await _saveCredential(apiKey, apiSecret);

    return {apiKey, apiSecret};
  }

  const credential = await _findCredential();
  if (credential) {
    apiKey = credential.account;
    apiSecret = credential.password;
    await _saveCredential(apiKey, apiSecret);

    return {apiKey, apiSecret};
  }

  apiKey = await prompt(apiKeyQuestion);
  apiSecret = await prompt(apiSecretQuestion);

  await _saveCredential(apiKey, apiSecret);

  return {apiKey, apiSecret};
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
    .filter((acc) => acc.substr(0, 2).toLowerCase() === 'sk' && acc.length === 34);

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
