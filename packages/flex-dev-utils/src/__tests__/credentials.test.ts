import * as credentials from '../credentials';

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
  // @ts-ignore
  const exit = jest.spyOn(process, 'exit').mockReturnValue();

  const accountSid = 'AC00000000000000000000000000000000';
  const authToken = 'abc123';
  const credential = {
    account: accountSid,
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
    it('should quit if CI=true and accountSid and authToken are not provided', async () => {
      process.env.CI = 'true';
      process.env.TWILIO_ACCOUNT_SID = 'ACxxx';

      await credentials.getCredential();

      expect(exit).toHaveBeenCalledTimes(1);
      expect(exit).toHaveBeenCalledWith(1);
    });

    it('should quit if invalid accountSid env var is provided', async () => {
      process.env.TWILIO_ACCOUNT_SID = 'AB00000000000000000000000000000000';
      process.env.TWILIO_AUTH_TOKEN = authToken;

      const validateAccountSid = jest
        .spyOn(validators, 'validateAccountSid')
        .mockResolvedValue(false);
      const _findCredential = jest.spyOn(credentials, '_findCredential');

      await credentials.getCredential();

      expect(validateAccountSid).toHaveBeenCalledTimes(1);
      expect(_findCredential).not.toHaveBeenCalled();
      expect(exit).toHaveBeenCalledTimes(1);
    });

    it('should use env variables', async () => {
      process.env.TWILIO_ACCOUNT_SID = accountSid;
      process.env.TWILIO_AUTH_TOKEN = authToken;

      const validateAccountSid = jest
        .spyOn(validators, 'validateAccountSid')
        .mockResolvedValue(true);
      const _findCredential = jest.spyOn(credentials, '_findCredential');

      const creds = await credentials.getCredential();

      expect(validateAccountSid).toHaveBeenCalledTimes(1);
      expect(_findCredential).not.toHaveBeenCalled();
      expect(creds).toEqual({ accountSid, authToken });
    });

    it('should not ask for API key or password if credentials exist', async () => {
      jest
        .spyOn(credentials, '_findCredential')
        .mockImplementation(() => Promise.resolve(credential));

      const creds = await credentials.getCredential();

      expect(inquirer.prompt).not.toHaveBeenCalled();
      expect(creds).toEqual({accountSid, authToken});
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
        accountSid: 'promptAccountSid',
        authToken: 'promptAuthToken',
      });
    });
  });

  describe('_findCredential', () => {
    const accountSid1 = 'AC00000000000000000000000000000001';
    const credential1 = {
      account: accountSid1,
      password: 'authToken1',
    };
    const badCreds = {
      account: 'foo',
      password: 'pass',
    };

    beforeAll(() => {
      (credentials._findCredential as any).mockRestore();
    });

    it('should return the passed accountSid if match found', async () => {
      jest
        .spyOn(credentials, '_getService')
        .mockImplementation(() => Promise.resolve([credential, credential1]));

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
        .mockImplementation(() => Promise.resolve([credential]));

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
        .mockImplementation(() => Promise.resolve([credential, credential1]));

      const choose = jest.spyOn(inquirer, 'choose').mockResolvedValue(accountSid);

      const cred = await credentials._findCredential();

      expect(choose).toHaveBeenCalledTimes(1);
      expect(cred).toEqual(credential);
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
        .mockImplementation(() => Promise.resolve([credential, credential]));
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
