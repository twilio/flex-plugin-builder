import { AuthConfig } from 'flex-dev-utils/dist/credentials';
import ConfigurationClient from '../configurations';

import PluginsApiClient from '../pluginsApi';

describe('ConfigurationClient', () => {
  const accountSid = 'AC00000000000000000000000000000000';
  const auth: AuthConfig = {
    accountSid,
    authToken: 'abc',
  };

  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
    jest.clearAllMocks();
  });

  describe('getBaseUrl', () => {
    it('should get prod baseUrl', () => {
      const baseUrl = PluginsApiClient.getBaseUrl();

      expect(baseUrl).toEqual('https://flex-api.twilio.com/v1/PluginService');
    });
  });

  describe('hasFlag', () => {
    it('should return true', async () => {
      const client = new PluginsApiClient(auth);
      // @ts-ignore
      const get = jest.spyOn(client.http, 'get').mockResolvedValue();

      const result = await client.hasFlag();
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('/Plugins');
      expect(result).toEqual(true);
    });

    it('should return false', async () => {
      const client = new PluginsApiClient(auth);
      // @ts-ignore
      const get = jest.spyOn(client.http, 'get').mockRejectedValue();

      const result = await client.hasFlag();
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('/Plugins');
      expect(result).toEqual(false);
    });
  });
});
