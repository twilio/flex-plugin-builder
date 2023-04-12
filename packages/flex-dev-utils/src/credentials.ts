/* eslint-disable prefer-destructuring */
import { FlexPluginError } from './errors';
import { prompt, choose, Question } from './questions';
import { env } from './env';
import keychain, { Keychain, KeychainCredential } from './keychain';
import { isInputNotEmpty, validateAccountSid, validateApiKey } from './validators';

export const SERVICE_NAME = 'com.twilio.flex.plugins.builder';

export interface Credential {
  username: string;
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
 * Instantiates a keychain to use
 */
export const _getKeychain = (): Keychain => keychain(SERVICE_NAME);

/**
 * Gets the credential service
 * @private
 */
export const _getService = async (): Promise<KeychainCredential[]> => {
  if (env.isCI()) {
    return [];
  }

  return _getKeychain().findCredentials();
};

/**
 * Finds the credential. If more than one credential exists, then it prompt the user to choose one.
 *
 * @param accountSid  optional accountSid to find
 * @private
 */
export const _findCredential = async (accountSid?: string): Promise<Credential | null> => {
  const convertCredential = (credential: KeychainCredential): Credential => ({
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
  /* c8 ignore next */
  if (accounts.length === 1) {
    return convertCredential(credentials.find((cred) => cred.account === accounts[0]) as KeychainCredential);
  }

  const selectedAccount = await choose(chooseAccount, accounts);

  return convertCredential(credentials.find((cred) => cred.account === selectedAccount) as KeychainCredential);
};

/**
 * Saves the credential
 *
 * @param username   the username
 * @param password  the password
 * @private
 */
export const _saveCredential = async (username: string, password: string): Promise<void> => {
  // Do not store password on CI builds
  if (!env.isCI() && !process.env.SKIP_CREDENTIALS_SAVING) {
    await _getKeychain().setPassword(username, password);
  }
};

/**
 * Fetches the API Key/Secret and stores them in keychain.
 * If no credentials exists, then prompts the user to enter the credentials
 */
export const getCredential = async (): Promise<Credential> => {
  let username;
  let password;

  const missingCredentials = !(
    (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) ||
    (process.env.TWILIO_API_KEY && process.env.TWILIO_API_SECRET)
  );
  if (env.isCI() && missingCredentials) {
    throw new FlexPluginError('❌.  Running script in CI, but no AccountSid/AuthToken or API Key/Secret was provided');
  }

  // If both accountSid/authToken provided, then use that
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    if (!(await validateAccountSid(process.env.TWILIO_ACCOUNT_SID))) {
      throw new FlexPluginError('AccountSid is not valid.');
    }

    username = process.env.TWILIO_ACCOUNT_SID;
    password = process.env.TWILIO_AUTH_TOKEN;
    // If both apiKey/secret provided, then use that
  } else if (process.env.TWILIO_API_KEY && process.env.TWILIO_API_SECRET) {
    if (!(await validateApiKey(process.env.TWILIO_API_KEY))) {
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
  if (env.isCI()) {
    return Promise.resolve();
  }

  const credentials = await _getService();
  const promises = credentials.map(async (cred) => _getKeychain().deletePassword(cred.account));
  await Promise.all(promises);

  return Promise.resolve();
};

export default getCredential;
