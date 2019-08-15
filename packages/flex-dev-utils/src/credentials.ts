import { prompt, choose, Question } from './inquirer';
import logger from './logger';
import { isInputNotEmpty, validateAccountSid } from './validators';

// Keytar is installed as an optional dependency
// Try to load it here but do not fail if it fails to be required
let keytar: any;
try {
  // tslint:disable-next-line
  keytar = require('keytar');
} catch (e) { /* no-op */ }

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
  let accountSid;
  let authToken;

  const missingCredentials = !process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN;
  if (process.env.CI && missingCredentials) {
    logger.error('❌  Running script in CI, but no AccountSid and/or AuthToken was provided');
    return process.exit(1);
  }

  // If both accountSid/authToken provided, then use that
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    if (!await validateAccountSid(process.env.TWILIO_ACCOUNT_SID)) {
      logger.error('AccountSid is not valid.');
      return process.exit(1);
    }

    accountSid = process.env.TWILIO_ACCOUNT_SID;
    authToken = process.env.TWILIO_AUTH_TOKEN;
  } else {
    // Find credential
    const credential = await _findCredential(process.env.TWILIO_ACCOUNT_SID);
    if (credential) {
      accountSid = credential.account;
      authToken = credential.password;
    }
  }

  // No credentials were found; prompt for it
  if (!accountSid || !authToken) {
    accountSid = await prompt(accountSidQuestion);
    authToken = await prompt(authTokenQuestion);
  }

  process.env.TWILIO_ACCOUNT_SID = accountSid;
  process.env.TWILIO_AUTH_TOKEN = authToken;

  // Save the credential
  await _saveCredential(accountSid, authToken);

  return { accountSid, authToken };
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
  const credentials = await _getService();

  if (accountSid) {
    const match = credentials.find((cred) => cred.account === accountSid);
    if (match) {
      return match as Credential;
    }
  }

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
 * Gets the credential service
 * @private
 */
export const _getService = async (): Promise<Credential[]> => {
  if (process.env.CI) {
    return [];
  }

  return await _getKeytar().findCredentials(SERVICE_NAME);
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
    await _getKeytar().setPassword(SERVICE_NAME, account, password);
  }
};

/**
 * Keytar is required optionally and so may not exist.
 * Throw an error if it is tried to be used and it is not found
 *
 * @private
 */
export const _getKeytar = () => {
  if (keytar) {
    return keytar;
  }

  throw new Error('Optional dependency keytar was not installed');
};
