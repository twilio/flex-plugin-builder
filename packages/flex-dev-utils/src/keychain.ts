/*
 * Keytar is installed as an optional dependency
 * Try to load it here but do not fail if it fails to be required
 */
import { logger } from '.';

export interface KeychainCredential {
  account: string;
  password: string;
}

export interface Keychain {
  deletePassword: (account: string) => Promise<boolean>;
  findCredentials: () => Promise<KeychainCredential[]>;
  setPassword: (account: string, password: string) => Promise<void>;
}

/**
 * Keytar is required optionally and so may not exist.
 * It will throw an error if a local installation is not found.
 */
/* istanbul ignore next */
export const _getKeytar = () => {
  try {
    return require('keytar');
  } catch (e) {
    /* istanbul ignore next */
    if (!process.env.CI) {
      logger.debug('Failed to require keytar', e);
    }
  }

  throw new Error('Optional dependency keytar was not installed');
};

/**
 * main method that returns a keytar instance
 * @param service
 */
export default function (service: string): Keychain {
  const keytar = _getKeytar();

  return {
    deletePassword: (account: string) => keytar.deletePassword(service, account),
    findCredentials: () => keytar.findCredentials(service),
    setPassword: (account: string, password: string) => keytar.setPassword(service, account, password),
  };
}
