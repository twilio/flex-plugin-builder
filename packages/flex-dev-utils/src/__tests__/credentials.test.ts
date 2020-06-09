import * as credentials from '../credentials';
import { FlexPluginError } from '../errors';

jest.mock('keytar');
jest.mock('../logger');
jest.mock('../inquirer');
jest.mock('../validators');

// tslint:disable
const keytar = require('keytar');
const inquirer = require('../inquirer');
const validators = require('../validators');
// tslint:enable

describe('credentials', () => {
  const accountSid = 'AC00000000000000000000000000000000';
  const authToken = 'abc123';
  const apiKey = 'SK00000000000000000000000000000000';
  const apiSecret = 'abc123';
  const keyCredential = {
    account: accountSid,
    password: authToken,
  };
  const credential = {
    username: accountSid,
    password: authToken,
  };
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    process.env = { ...OLD_ENV };
  });

  describe('_getService', () => {
    it('should not call findCredentials if CI is true', async () => {
      process.env.CI = 'true';
      const result = await credentials._getService();

      expect(keytar.findCredentials).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should findCredentials', async () => {
      const findCredentials = jest.spyOn(keytar, 'findCredentials').mockResolvedValue([]);
      const result = await credentials._getService();

      expect(findCredentials).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);

      findCredentials.mockRestore();
    });
  });

  describe('getCredential', () => {
    it('should quit if CI=true and accountSid and authToken or api key and secret are not provided', async () => {
      process.env.CI = 'true';

      try {
        await credentials.getCredential();
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
      }
    });

    it('should quit if invalid accountSid env var is provided', async () => {
      process.env.TWILIO_ACCOUNT_SID = 'AB00000000000000000000000000000000';
      process.env.TWILIO_AUTH_TOKEN = authToken;

      const validateAccountSid = jest
        .spyOn(validators, 'validateAccountSid')
        .mockResolvedValue(false);
      const _findCredential = jest.spyOn(credentials, '_findCredential');

      try {
        await credentials.getCredential();
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
      }

      expect(validateAccountSid).toHaveBeenCalledTimes(1);
      expect(_findCredential).not.toHaveBeenCalled();
    });

    it('should quit if invalid apiKey env var is provided', async () => {
      process.env.TWILIO_API_KEY = 'SA00000000000000000000000000000000';
      process.env.TWILIO_API_SECRET = authToken;

      const validateApiKey = jest
        .spyOn(validators, 'validateApiKey')
        .mockResolvedValue(false);
      const _findCredential = jest.spyOn(credentials, '_findCredential');

      try {
        await credentials.getCredential();
      } catch (e) {
        expect(e).toBeInstanceOf(FlexPluginError);
      }

      expect(validateApiKey).toHaveBeenCalledTimes(1);
      expect(_findCredential).not.toHaveBeenCalled();
    });

    it('should use env variables (accountSid and authToken)', async () => {
      process.env.TWILIO_ACCOUNT_SID = accountSid;
      process.env.TWILIO_AUTH_TOKEN = authToken;

      const validateAccountSid = jest
        .spyOn(validators, 'validateAccountSid')
        .mockResolvedValue(true);
      const _findCredential = jest.spyOn(credentials, '_findCredential');

      const creds = await credentials.getCredential();

      expect(validateAccountSid).toHaveBeenCalledTimes(1);
      expect(_findCredential).not.toHaveBeenCalled();
      expect(creds).toEqual({
        username: accountSid,
        password: authToken
      });
    });

    it('should use env variables (api key and secret)', async () => {
      process.env.TWILIO_API_KEY = apiKey;
      process.env.TWILIO_API_SECRET = apiSecret;

      const validateApiKey = jest
        .spyOn(validators, 'validateApiKey')
        .mockResolvedValue(true);
      const _findCredential = jest.spyOn(credentials, '_findCredential');

      const creds = await credentials.getCredential();

      expect(validateApiKey).toHaveBeenCalledTimes(1);
      expect(_findCredential).not.toHaveBeenCalled();
      expect(creds).toEqual({
        username: apiKey,
        password: apiSecret
      });
    });

    it('should not ask for API key or password if credentials exist', async () => {
      jest
        .spyOn(credentials, '_findCredential')
        .mockImplementation(() => Promise.resolve(credential));

      const creds = await credentials.getCredential();

      expect(inquirer.prompt).not.toHaveBeenCalled();
      expect(creds).toEqual({
        username: accountSid,
        password: authToken
      });
    });

    it('should ask for credentials if nothing exists', async () => {
      jest
        .spyOn(credentials, '_findCredential')
        .mockImplementation(() => Promise.resolve(null));

      jest
        .spyOn(inquirer, 'prompt')
        .mockImplementation((question: any) => {
          if (question.type === 'input') {
            return 'promptAccountSid';
          } else {
            return 'promptAuthToken';
          }
        });

      const creds = await credentials.getCredential();

      expect(inquirer.prompt).toHaveBeenCalledTimes(2);
      expect(creds).toEqual({
        username: 'promptAccountSid',
        password: 'promptAuthToken',
      });
    });
  });

  describe('_findCredential', () => {
    const accountSid1 = 'AC00000000000000000000000000000001';}
    const keytarCredential1 = {
      account: accountSid1,
      password: 'authToken1',
    };
    const keytarCredential2 = {
      account: apiKey,
      password: 'authToken1',
    };
    const credential1 = {
      username: accountSid1,
      password: 'authToken1',
    };
    const credential2 = {
      username: apiKey,
      password: 'authToken1',
    };
    const badCreds = {
      account: 'foo',
      password: 'pass',
    };

    beforeAll(() => {
      (credentials._findCredential as any).mockRestore();
    });

    it('should return the passed apiKey if match found', async () => {
      jest
        .spyOn(credentials, '_getService')
        .mockImplementation(() => Promise.resolve([keytarCredential1, keytarCredential2]));

      const cred = await credentials._findCredential(apiKey);

      expect(cred).toEqual(credential2);
      expect(inquirer.prompt).not.toHaveBeenCalled();
    });

    it('should return the passed accountSid if match found', async () => {
      jest
        .spyOn(credentials, '_getService')
        .mockImplementation(() => Promise.resolve([keytarCredential1, keytarCredential1]));

      const cred = await credentials._findCredential(accountSid1);

      expect(cred).toEqual(credential1);
      expect(inquirer.prompt).not.toHaveBeenCalled();
    });

    it('should return null if credentials is empty', async () => {
      jest
        .spyOn(credentials, '_getService')
        .mockImplementation(() => Promise.resolve([]));

      const cred = await credentials._findCredential();

      expect(inquirer.prompt).not.toHaveBeenCalled();
      expect(cred).toBeNull();
    });

    it('should return single credential if only one exists', async () => {
      jest
        .spyOn(credentials, '_getService')
        .mockImplementation(() => Promise.resolve([keyCredential]));

      const cred = await credentials._findCredential();

      expect(inquirer.prompt).not.toHaveBeenCalled();
      expect(cred).toEqual(credential);
    });

    it('should return null if bogus credentials exist', async () => {
      jest
        .spyOn(credentials, '_getService')
        .mockImplementation(() => Promise.resolve([badCreds, badCreds]));

      const cred = await credentials._findCredential();

      expect(inquirer.prompt).not.toHaveBeenCalled();
      expect(cred).toBeNull();
    });

    it('should ask for you to choose if multiple credentials found', async () => {
      jest
        .spyOn(credentials, '_getService')
        .mockImplementation(() => Promise.resolve([keyCredential, keyCredential]));

      const choose = jest.spyOn(inquirer, 'choose').mockResolvedValue(accountSid);

      const cred = await credentials._findCredential();

      expect(choose).toHaveBeenCalledTimes(1);
      expect(cred).toEqual(credential);
    });
  });

  describe('_saveCredential', () => {
    it('should not save if CI is set to true', () => {
      const _getKeytar = jest.spyOn(credentials, '_getKeytar');
      process.env.CI = 'true';

      credentials._saveCredential(accountSid, authToken);
      expect(_getKeytar).not.toHaveBeenCalled();

      _getKeytar.mockRestore();
    });

    it('should not save if SKIP_CREDENTIALS_SAVING is set to true', () => {
      const _getKeytar = jest.spyOn(credentials, '_getKeytar');
      process.env.SKIP_CREDENTIALS_SAVING = 'true';

      credentials._saveCredential(accountSid, authToken);
      expect(_getKeytar).not.toHaveBeenCalled();

      _getKeytar.mockRestore();
    });
  });

  describe('_getKeytar', () => {
    it('should get keytar if it exists', () => {
      const _keytar = credentials._getKeytar();
      expect(_keytar).not.toBeNull();
    });
  });

  describe('clearCredentials', () => {
    it('should not delete anything if CI=true', async () => {
      process.env.CI = 'true';
      const _getService = jest.spyOn(credentials, '_getService');

      await credentials.clearCredentials();

      expect(_getService).not.toHaveBeenCalled();

      _getService.mockRestore();
    });

    it('should clear credentials', async () => {
      const _getService = jest
        .spyOn(credentials, '_getService')
        .mockImplementation(() => Promise.resolve([keyCredential, keyCredential]));
      const deletePassword = jest
        .spyOn(keytar, 'deletePassword')
        .mockResolvedValue(true);

      await credentials.clearCredentials();

      expect(_getService).toHaveBeenCalled();
      expect(deletePassword).toHaveBeenCalledTimes(2);

      _getService.mockRestore();
      deletePassword.mockRestore();
    });
  });
});
