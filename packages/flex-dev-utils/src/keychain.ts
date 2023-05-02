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

interface Keytar {
  deletePassword: (service: string, account: string) => Promise<boolean>;
  findCredentials: (service: string) => Promise<KeychainCredential[]>;
  setPassword: (service: string, account: string, password: string) => Promise<void>;
}

/**
 * Keytar is required optionally and so may not exist.
 * It will throw an error if a local installation is not found.
 */
/* c8 ignore next */
export const _getKeytar = (): Keytar => {
  try {
    // eslint-disable-next-line global-require, @typescript-eslint/no-require-imports
    return require('keytar');
  } catch (e) {
    /* c8 ignore next */
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
export default function keychain(service: string): Keychain {
  const keytar = _getKeytar();

  return {
    deletePassword: async (account: string) => keytar.deletePassword(service, account),
    findCredentials: async () => keytar.findCredentials(service),
    setPassword: async (account: string, password: string) => keytar.setPassword(service, account, password),
  };
}
