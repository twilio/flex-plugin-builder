import Credentials, { CredentialsInstance } from '@buttercup/credentials';

import * as credentials from '../credentials';
import * as fs from '../fs';

jest.mock('@buttercup/credentials');
jest.mock('../logger');
jest.mock('../inquirer');

// tslint:disable
const inquirer = require('../inquirer');
// tslint:enable

describe('credentials', () => {
  // @ts-ignore
  const exist = jest.spyOn(process, 'exit').mockReturnValue();

  const accountSid = 'AC00000000000000000000000000000000';
  const authToken = 'abc123';
  const authConfig = { accountSid, authToken };
  const existingCreds: CredentialsInstance[] = [
    {
      toSecureString: () => Promise.resolve('secure1'),
      data: {
        type: 'Twilio',
        accountSid: 'AC00000000000000000000000000000001',
        authToken: 'account1',
      },
    },
    {
      toSecureString: () => Promise.resolve('secure2'),
      data: {
        type: 'Twilio',
        accountSid: 'AC00000000000000000000000000000002',
        authToken: 'account2',
      },
    },
  ];
  const badCredential: CredentialsInstance = {
    toSecureString: () => Promise.resolve('secure1'),
    data: {
      type: 'Twilio',
      accountSid: 'foo',
      authToken: 'bar',
    },
  };

  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    process.env = { ...OLD_ENV };
  });

  describe('_readCredentialFile', () => {
    it('should not read file if running in CI', async () => {
      process.env.CI = 'true';
      const readFileSync = jest.spyOn(fs, 'readFileSync');

      const resp = await credentials._readCredentialFile('');

      expect(resp).toEqual([]);
      expect(readFileSync).not.toHaveBeenCalled();
    });

    it('should return empty array if no file is found', async () => {
      const readFileSync = jest.spyOn(fs, 'readFileSync');
      const existSync = jest
        .spyOn(fs.default, 'existsSync')
        .mockReturnValue(false);

      const resp = await credentials._readCredentialFile('');

      expect(resp).toEqual([]);
      expect(readFileSync).not.toHaveBeenCalled();
      expect(existSync).toHaveBeenCalledTimes(1);
    });

    it('should read and parse file', async () => {
      const readFileSync = jest
        .spyOn(fs, 'readFileSync')
        .mockReturnValue('line1\nline2');
      const existSync = jest
        .spyOn(fs.default, 'existsSync')
        .mockReturnValue(true);
      const fromSecureString = jest
        .spyOn(Credentials, 'fromSecureString')
        .mockResolvedValue(existingCreds[0]);

      const resp = await credentials._readCredentialFile('masterPassword');

      expect(resp).toEqual([existingCreds[0], existingCreds[0]]);
      expect(readFileSync).toHaveBeenCalledTimes(1);
      expect(existSync).toHaveBeenCalledTimes(1);
      expect(fromSecureString).toHaveBeenCalledTimes(2);
      expect(fromSecureString).toHaveBeenNthCalledWith(1, 'line1', 'masterPassword');
      expect(fromSecureString).toHaveBeenNthCalledWith(2, 'line2', 'masterPassword');
    });
  });

  describe('_saveCredential', () => {
    it('should not read file if running in CI', async () => {
      process.env.CI = 'true';
      const writeFileSync = jest.spyOn(fs.default, 'writeFileSync');
      const _readCredentialFile = jest.spyOn(credentials, '_readCredentialFile');

      await credentials._saveCredential(authConfig, '');

      expect(_readCredentialFile).not.toHaveBeenCalled();
      expect(writeFileSync).not.toHaveBeenCalled();
    });

    it('should append new credential', async () => {
      // @ts-ignore
      Credentials.mockImplementation(() => ({
        toSecureString: () => Promise.resolve('secure3'),
      }));
      const writeFileSync = jest
        .spyOn(fs.default, 'writeFileSync')
        .mockReturnValue();
      const _readCredentialFile = jest
        .spyOn(credentials, '_readCredentialFile')
        .mockResolvedValue(existingCreds);

      await credentials._saveCredential(authConfig, 'masterPassword');

      expect(_readCredentialFile).toHaveBeenCalledTimes(1);
      expect(_readCredentialFile).toHaveBeenCalledWith('masterPassword');
      expect(writeFileSync).toHaveBeenCalledTimes(1);
      expect(writeFileSync).toHaveBeenCalledWith(expect.any(String), 'secure1\nsecure2\nsecure3');
    });

    it('should overwrite existing credential', async () => {
      // @ts-ignore
      Credentials.mockImplementation(() => ({
        toSecureString: () => Promise.resolve('secure3'),
      }));
      const writeFileSync = jest
        .spyOn(fs.default, 'writeFileSync')
        .mockReturnValue();
      const _readCredentialFile = jest
        .spyOn(credentials, '_readCredentialFile')
        .mockResolvedValue(existingCreds);

      await credentials._saveCredential(existingCreds[0].data, 'masterPassword');

      expect(_readCredentialFile).toHaveBeenCalledTimes(1);
      expect(_readCredentialFile).toHaveBeenCalledWith('masterPassword');
      expect(writeFileSync).toHaveBeenCalledTimes(1);
      expect(writeFileSync).toHaveBeenCalledWith(expect.any(String), 'secure2\nsecure3');
    });
  });

  describe('_findCredential', () => {
    it('should return null if no credentials found', async () => {
      const _readCredentialFile = jest
        .spyOn(credentials, '_readCredentialFile')
        .mockResolvedValue([]);

      const cred = await credentials._findCredential('masterPassword');

      expect(_readCredentialFile).toHaveBeenCalledTimes(1);
      expect(_readCredentialFile).toHaveBeenCalledWith('masterPassword');
      expect(inquirer.prompt).not.toHaveBeenCalled();
      expect(cred).toBeNull();
    });

    it('should return null if bogus credentials exist', async () => {
      const _readCredentialFile = jest
        .spyOn(credentials, '_readCredentialFile')
        .mockResolvedValue([badCredential, badCredential]);

      const cred = await credentials._findCredential('masterPassword');

      expect(_readCredentialFile).toHaveBeenCalledTimes(1);
      expect(_readCredentialFile).toHaveBeenCalledWith('masterPassword');
      expect(inquirer.prompt).not.toHaveBeenCalled();
      expect(cred).toBeNull();
    });

    it('should return single credential if only one exists', async () => {
      const _readCredentialFile = jest
        .spyOn(credentials, '_readCredentialFile')
        .mockResolvedValue([existingCreds[0]]);

      const cred = await credentials._findCredential('masterPassword');

      expect(_readCredentialFile).toHaveBeenCalledTimes(1);
      expect(_readCredentialFile).toHaveBeenCalledWith('masterPassword');
      expect(inquirer.prompt).not.toHaveBeenCalled();
      expect(cred).toEqual(existingCreds[0].data);
    });

    it('should return the requested accountSid if match found', async () => {
      const sid = existingCreds[0].data.accountSid;
      const _readCredentialFile = jest
        .spyOn(credentials, '_readCredentialFile')
        .mockResolvedValue(existingCreds);

      const cred = await credentials._findCredential('masterPassword', sid);

      expect(_readCredentialFile).toHaveBeenCalledTimes(1);
      expect(_readCredentialFile).toHaveBeenCalledWith('masterPassword');
      expect(inquirer.prompt).not.toHaveBeenCalled();
      expect(cred).toEqual(existingCreds[0].data);
    });
  });

  describe('clearCredentials', () => {
    it('should not call remove if file does not exists', async () => {
      const existsSync = jest.spyOn(fs.default, 'existsSync').mockReturnValue(false);
      const unlinkSync = jest.spyOn(fs.default, 'unlinkSync').mockReturnValue();

      await credentials.clearCredentials();

      expect(existsSync).toHaveBeenCalledTimes(1);
      expect(unlinkSync).not.toHaveBeenCalled();
    });

    it('should remove credential if it exists', async () => {
      const existsSync = jest.spyOn(fs.default, 'existsSync').mockReturnValue(true);
      const unlinkSync = jest.spyOn(fs.default, 'unlinkSync').mockReturnValue();

      await credentials.clearCredentials();

      expect(existsSync).toHaveBeenCalledTimes(1);
      expect(unlinkSync).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCredential', () => {
    it('should quit if CI=true but accountSid is not provided', async () => {
      process.env.CI = 'true';
      process.env.TWILIO_ACCOUNT_SID = 'ACxxx';

      await credentials.getCredential();

      expect(exist).toHaveBeenCalledTimes(1);
      expect(exist).toHaveBeenCalledWith(1);
    });

    it('should quit if CI=true but authToken is not provided', async () => {
      process.env.CI = 'true';
      process.env.TWILIO_AUTH_TOKEN = '123';

      await credentials.getCredential();

      expect(exist).toHaveBeenCalledTimes(1);
      expect(exist).toHaveBeenCalledWith(1);
    });

    it('it should ask for masterPassword if not provided', async () => {
      process.env.TWILIO_ACCOUNT_SID = accountSid;
      process.env.TWILIO_AUTH_TOKEN = authToken;

      const prompt = jest
        .spyOn(inquirer, 'prompt')
        .mockResolvedValue('the-password');
      const _saveCredential = jest
        .spyOn(credentials, '_saveCredential')
        .mockResolvedValue();

      const cred = await credentials.getCredential();

      expect(cred).toEqual({ accountSid, authToken });
      expect(prompt).toHaveBeenCalled();
      expect(process.env.MASTER_PASSWORD).toEqual('the-password');
      expect(_saveCredential).toHaveBeenCalledWith({ accountSid, authToken }, 'the-password');
    });

    it('should not ask for accountSid/authToken if provided', async () => {
      process.env.TWILIO_ACCOUNT_SID = accountSid;
      process.env.TWILIO_AUTH_TOKEN = authToken;
      process.env.MASTER_PASSWORD = 'password';

      const _findCredential = jest
        .spyOn(credentials, '_findCredential');
      const _saveCredential = jest
        .spyOn(credentials, '_saveCredential')
        .mockResolvedValue();

      const cred = await credentials.getCredential();

      expect(cred).toEqual({ accountSid, authToken });

      expect(_findCredential).not.toHaveBeenCalled();
      expect(inquirer.prompt).not.toHaveBeenCalled();
      expect(_saveCredential).toHaveBeenCalledWith({ accountSid, authToken }, 'password');
    });

    it('should not prompt if accountSid is provided and authToken is found', async () => {
      process.env.TWILIO_ACCOUNT_SID = accountSid;
      process.env.MASTER_PASSWORD = 'password';

      const _findCredential = jest
        .spyOn(credentials, '_findCredential')
        .mockResolvedValue(authConfig);
      const _saveCredential = jest
        .spyOn(credentials, '_saveCredential')
        .mockResolvedValue();

      const cred = await credentials.getCredential();

      expect(cred).toEqual({ accountSid, authToken });

      expect(_findCredential).toHaveBeenCalledTimes(1);
      expect(_findCredential).toHaveBeenCalledWith('password', accountSid);
      expect(inquirer.prompt).not.toHaveBeenCalled();
      expect(_saveCredential).toHaveBeenCalledWith({ accountSid, authToken }, 'password');
    });

    it('should prompt for accountSid/authToken', async () => {
      process.env.MASTER_PASSWORD = 'password';

      const prompt = jest.spyOn(inquirer, 'prompt').mockResolvedValue('value');
      const _findCredential = jest
        .spyOn(credentials, '_findCredential')
        .mockResolvedValue(null);
      const _saveCredential = jest
        .spyOn(credentials, '_saveCredential')
        .mockResolvedValue();

      const fakeCred = { accountSid: 'value', authToken: 'value' };
      const cred = await credentials.getCredential();

      expect(cred).toEqual(fakeCred);
      expect(_findCredential).toHaveBeenCalledTimes(1);
      expect(_findCredential).toHaveBeenCalledWith('password', undefined);
      expect(inquirer.prompt).toHaveBeenCalledTimes(2);
      expect(_saveCredential).toHaveBeenCalledWith(fakeCred, 'password');
      expect(process.env.TWILIO_ACCOUNT_SID).toEqual('value');
      expect(process.env.TWILIO_AUTH_TOKEN).toEqual('value');
    });
  });
});
