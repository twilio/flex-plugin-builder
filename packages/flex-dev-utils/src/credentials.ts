import Credentials, { CredentialsInstance } from '@buttercup/credentials';
import { join } from 'path';
import { existsSync, writeFileSync, unlinkSync } from 'fs';

import { getConfigDir, readFileSync } from './fs';
import {
  choose,
  inputNotEmpty,
  accountSidValid,
  isPasswordStrong,
  prompt,
  Question,
} from './inquirer';
import logger from './logger';
import { isSidOfType } from './sids';

const CREDENTIAL_FILE = join(getConfigDir(), 'credentials.bcup');

export interface AuthConfig {
  accountSid: string;
  authToken: string;
}

/**
 * Prompt question for master password
 */
const masterPasswordQuestion: Question = {
  type: 'password',
  name: 'masterPassword',
  message: 'Enter a password to use for local Keychain:',
  validate: isPasswordStrong,
};

/**
 * Prompt question for accountSid
 */
const accountSidQuestion: Question = {
  type: 'input',
  name: 'accountSid',
  message: 'Enter your Twilio Account Sid:',
  validate: accountSidValid,
};

const authTokenQuestion: Question = {
  type: 'password',
  name: 'authToken',
  message: 'Enter your Twilio Auth Token:',
  validate: inputNotEmpty,
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
  let accountSid: string = '';
  let authToken: string = '';
  let masterPassword: string = '';

  const missingCredentials = !process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN;
  if (process.env.CI && missingCredentials) {
    logger.error('❌  Running script in CI, but no AccountSid and/or AuthToken was provided');
    return process.exit(1);
  }

  // Prompts the user for master password
  if (process.env.MASTER_PASSWORD) {
    masterPassword = process.env.MASTER_PASSWORD;
  } else if (!process.env.CI) {
    masterPassword = await prompt(masterPasswordQuestion);
    process.env.MASTER_PASSWORD = masterPassword;
  }

  // If both accountSid/authToken provided, then use that
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    if (!isSidOfType(process.env.TWILIO_ACCOUNT_SID, 'AC')) {
      logger.error('AccountSid is not valid.');
      return process.exit(1);
    }

    accountSid = process.env.TWILIO_ACCOUNT_SID;
    authToken = process.env.TWILIO_AUTH_TOKEN;
  } else {
    // Find credential
    const credential = await _findCredential(masterPassword, process.env.TWILIO_ACCOUNT_SID);
    if (credential) {
      accountSid = credential.accountSid;
      authToken = credential.authToken;
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
  await _saveCredential({ accountSid, authToken }, masterPassword);

  return { accountSid, authToken };
};

/**
 * Clears the credentials
 */
export const clearCredentials = () => {
  if (existsSync(CREDENTIAL_FILE)) {
    unlinkSync(CREDENTIAL_FILE);
  }
};

/**
 * Finds the credential. If more than one credential exists, then it prompt the user to choose one.
 *
 * @private
 */
export const _findCredential = async (masterPassword: string, accountSid?: string): Promise<AuthConfig | null> => {
  const credentials = await _readCredentialFile(masterPassword);

  if (accountSid) {
    const match = credentials.find((cred) => cred.data.accountSid === accountSid);
    if (match) {
      return match.data as AuthConfig;
    } else {
      return null;
    }
  }

  const accounts = credentials
    .map((cred) => cred.data.accountSid)
    .filter((acc) => acc.substr(0, 2).toLowerCase() === 'ac' && acc.length === 34);

  if (credentials.length === 0) {
    return null;
  }
  if (credentials.length === 1) {
    return credentials[0].data as AuthConfig;
  }
  if (accounts.length === 0) {
    return null;
  }
  if (accounts.length === 1) {
    // @ts-ignore
    return credentials
      .find((cred) => cred.data.accountSid === accounts[0]).data as AuthConfig;
  }

  const selectedAccount = await choose(chooseAccount, accounts);

  // @ts-ignore
  return credentials
    .find((cred) => cred.data.accountSid === selectedAccount).data as AuthConfig;
};

/**
 * Encrypts and saves the credentials
 *
 * @param credential      the credential to save
 * @param masterPassword  the master password
 * @private
 */
export const _saveCredential = async (credential: AuthConfig, masterPassword: string): Promise<void> => {
  // Do not store password on CI builds
  if (process.env.CI) {
    return Promise.resolve();
  }

  // New credential to save; we'll de-dupe later
  const newCredential = new Credentials({
                                          type: 'Twilio',
                                          accountSid: credential.accountSid,
                                          authToken: credential.authToken,
                                        });

  // Get all existing credentials and de-dupe
  const allCredentials = await _readCredentialFile(masterPassword);
  const credentials = allCredentials.filter((cred) => cred.data.accountSid !== credential.accountSid);
  credentials.push(newCredential);

  // Encrypt all credentials
  const promises = credentials
    .map(async (cred) => await cred.toSecureString(masterPassword));
  const secureStrings = await Promise.all(promises);

  // Write to file
  writeFileSync(CREDENTIAL_FILE, secureStrings.join('\n'));

  return Promise.resolve();
};

/**
 * Reads all credentials from the file, and decrypts them
 *
 * @param masterPassword  the master password to decrypt
 * @private
 */
export const _readCredentialFile = async (masterPassword: string): Promise<CredentialsInstance[]> => {
  if (process.env.CI) {
    return [];
  }

  if (!existsSync(CREDENTIAL_FILE)) {
    return [];
  }

  const promises = readFileSync(CREDENTIAL_FILE)
    .split('\n')
    .map((line) => Credentials.fromSecureString(line, masterPassword));

  return await Promise.all(promises);
};

export default {
  getCredential,
  clearCredentials,
};
