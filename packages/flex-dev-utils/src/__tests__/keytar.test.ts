import * as keytar from '../keytar';

jest.mock('keytar');
jest.mock('../logger');
jest.mock('../inquirer');

// tslint:disable
const _keytar = require('keytar');
const inquirer = require('../inquirer');
// tslint:enable

describe('keytar', () => {
  const apiKey = 'SKxxx';
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
      const credentials = await keytar.getService();

      expect(_keytar.findCredentials).not.toHaveBeenCalled();
      expect(credentials).toEqual([]);
    });

    it('should call findCredentials', async () => {
      await keytar.getService();

      expect(_keytar.findCredentials).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCredentials', () => {
    it('should not ask for API key if env is already provided', async () => {
      process.env.TWILIO_API_KEY = 'envApiKey';

      jest
        .spyOn(keytar, 'getService')
        .mockImplementation(() => Promise.resolve([]));

      jest
        .spyOn(inquirer, 'prompt')
        .mockImplementation(() => ({apiSecret: 'promptSecret'}));

      const creds = await keytar.getCredentials();

      expect(inquirer.prompt).toHaveBeenCalledTimes(1);
      expect(creds).toEqual({apiKey: 'envApiKey', apiSecret: 'promptSecret'});
    });

    it('should not ask for API secret if env is already provided', async () => {
      process.env.TWILIO_API_SECRET = 'envApiSecret';

      jest
        .spyOn(keytar, 'getService')
        .mockImplementation(() => Promise.resolve([]));

      jest
        .spyOn(inquirer, 'prompt')
        .mockImplementation(() => ({apiKey: 'promptKey'}));

      const creds = await keytar.getCredentials();

      expect(inquirer.prompt).toHaveBeenCalledTimes(1);
      expect(creds).toEqual({apiKey: 'promptKey', apiSecret: 'envApiSecret'});
    });

    it('should not ask for API key or password if credentials exist', async () => {
      jest
        .spyOn(keytar, 'getService')
        .mockImplementation(() => Promise.resolve([credential]));

      jest
        .spyOn(inquirer, 'prompt')
        .mockImplementation(() => ({}));

      const creds = await keytar.getCredentials();

      expect(inquirer.prompt).not.toHaveBeenCalled();
      expect(creds).toEqual({apiKey, apiSecret});
    });

    it('should ask for both apiKey and apiSecret and save credentials', async () => {
      jest
        .spyOn(keytar, 'getService')
        .mockImplementation(() => Promise.resolve([]));

      jest
        .spyOn(inquirer, 'prompt')
        .mockImplementation(() => ({apiKey: 'promptKey', apiSecret: 'promptSecret'}));

      const creds = await keytar.getCredentials();

      expect(inquirer.prompt).toHaveBeenCalledTimes(2);
      expect(_keytar.setPassword).toHaveBeenCalledTimes(1);
      expect(_keytar.setPassword).toHaveBeenCalledWith(expect.any(String), 'promptKey', 'promptSecret');

      expect(creds).toEqual({apiKey: 'promptKey', apiSecret: 'promptSecret'});
    });

    it('should ignore setting password if CI=true', async () => {
      process.env.CI = 'true';

      jest
        .spyOn(keytar, 'getService')
        .mockImplementation(() => Promise.resolve([]));

      jest
        .spyOn(inquirer, 'prompt')
        .mockImplementation(() => ({apiKey: 'promptKey', apiSecret: 'promptSecret'}));

      const creds = await keytar.getCredentials();

      expect(inquirer.prompt).toHaveBeenCalledTimes(2);
      expect(_keytar.setPassword).not.toHaveBeenCalled();

      expect(creds).toEqual({apiKey: 'promptKey', apiSecret: 'promptSecret'});
    });
  });
});
