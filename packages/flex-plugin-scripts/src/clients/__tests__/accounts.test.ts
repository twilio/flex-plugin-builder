import { AuthConfig } from 'flex-dev-utils/dist/credentials';
import BaseClient from '../baseClient';
import AccountClient from '../accounts';
import ConfigurationClient from '../configurations';

describe('AccountClient', () => {
  const auth: AuthConfig = {
    username: 'AC00000000000000000000000000000000',
    password: 'abc',
  };

  describe('getBaseUrl', () => {
    it('should get prod baseUrl', () => {
      const getBaseUrl = jest.spyOn(BaseClient, 'getBaseUrl');
      const baseUrl = AccountClient.getBaseUrl();

      expect(baseUrl).toEqual('https://api.twilio.com/2010-04-01');
      expect(getBaseUrl).toHaveBeenCalledTimes(1);
      expect(getBaseUrl).toHaveBeenCalledWith('api', '2010-04-01');
    });
  });

  describe('get', () => {
    it('should get configuration', async () => {
      const client = new AccountClient(auth);
      const account = {
        account_sid: auth.username,
        friendly_name: 'test-account',
      };
      // @ts-ignore
      const get = jest.spyOn(client.http, 'get').mockResolvedValue(account);

      const result = await client.get(auth.username);

      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith(expect.stringContaining(AccountClient.BaseUrl));
      expect(get).toHaveBeenCalledWith(expect.stringContaining('.json'));
      expect(result).toEqual(account);
    });
  });
});
