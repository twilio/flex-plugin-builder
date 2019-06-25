import * as keytar from '../keytar';

jest.mock('keytar');
jest.mock('../logger');
jest.mock('../inquirer');

// tslint:disable
const _keytar = require('keytar');
const inquirer = require('../inquirer');
// tslint:enable

describe('keytar', () => {
  const apiKey = 'SKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
  const apiSecret = 'abc123';
  const credential = {
    account: apiKey,
    password: apiSecret,
  };

  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();

    // keytar.getService.mockImplementation(() => {});

    process.env = { ...OLD_ENV };
  });

  describe('getService', () => {
    it('should not findCredentials if CI is true', async () => {
      process.env.CI = 'true';
      const credentials = await keytar._getService();

      expect(_keytar.findCredentials).not.toHaveBeenCalled();
      expect(credentials).toEqual([]);
    });
  });

  describe('getCredentials', () => {
    it('should use env variables', async () => {
      process.env.TWILIO_API_KEY = 'envApiKey';
      process.env.TWILIO_API_SECRET = 'envApiSecret';

      jest.spyOn(keytar, '_findCredential');

      const creds = await keytar.getCredentials();

      expect(keytar._findCredential).not.toHaveBeenCalled();
      expect(creds).toEqual({apiKey: 'envApiKey', apiSecret: 'envApiSecret'});
    });

    it('should not ask for API key or password if credentials exist', async () => {
      jest
        .spyOn(keytar, '_findCredential')
        .mockImplementation(() => Promise.resolve(credential));

      const creds = await keytar.getCredentials();

      expect(inquirer.prompt).not.toHaveBeenCalled();
      expect(creds).toEqual({apiKey, apiSecret});
    });

    it('should ask for credentials if nothing exists', async () => {
      jest
        .spyOn(keytar, '_findCredential')
        .mockImplementation(() => Promise.resolve(null));

      jest
        .spyOn(inquirer, 'prompt')
        .mockImplementation((question: any) => {
          if (question.type === 'input') {
            return 'promptKey';
          } else {
            return 'promptSecret';
          }
        });

      const creds = await keytar.getCredentials();

      expect(inquirer.prompt).toHaveBeenCalledTimes(2);
      expect(creds).toEqual({apiKey: 'promptKey', apiSecret: 'promptSecret'});
    });

    it('should ignore setting password if CI=true', async () => {
      process.env.CI = 'true';

      jest
        .spyOn(keytar, '_findCredential')
        .mockImplementation(() => Promise.resolve(null));

      jest
        .spyOn(inquirer, 'prompt')
        .mockImplementation((question: any) => {
          if (question.type === 'input') {
            return 'promptKey';
          } else {
            return 'promptSecret';
          }
        });

      const creds = await keytar.getCredentials();

      expect(inquirer.prompt).toHaveBeenCalledTimes(2);
      expect(_keytar.setPassword).not.toHaveBeenCalled();

      expect(creds).toEqual({apiKey: 'promptKey', apiSecret: 'promptSecret'});
    });
  });

  describe('_findCredential', () => {
    const badCreds = {
      account: 'foo',
      password: 'pass',
    };

    beforeAll(() => {
      (keytar._findCredential as any).mockRestore();
    });

    it('should return null if credentials is empty', async () => {
      jest
        .spyOn(keytar, '_getService')
        .mockImplementation(() => Promise.resolve([]));

      const cred = await keytar._findCredential();

      expect(inquirer.prompt).not.toHaveBeenCalled();
      expect(cred).toBeNull();
    });

    it('should return single credential if only one exists', async () => {
      jest
        .spyOn(keytar, '_getService')
        .mockImplementation(() => Promise.resolve([credential]));

      const cred = await keytar._findCredential();

      expect(inquirer.prompt).not.toHaveBeenCalled();
      expect(cred).toEqual(credential);
    });

    it('should return null if bogus credentials exist', async () => {
      jest
        .spyOn(keytar, '_getService')
        .mockImplementation(() => Promise.resolve([badCreds, badCreds]));

      const cred = await keytar._findCredential();

      expect(inquirer.prompt).not.toHaveBeenCalled();
      expect(cred).toBeNull();
    });
  });
});
