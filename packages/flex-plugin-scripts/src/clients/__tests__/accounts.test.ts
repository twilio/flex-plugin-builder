/* eslint-disable camelcase */
import { Credential } from '@twilio/flex-dev-utils';

import AccountClient from '../accounts';

describe('AccountClient', () => {
  const auth: Credential = {
    username: 'AC00000000000000000000000000000000',
    password: 'abc',
  };

  describe('get', () => {
    it('should get configuration', async () => {
      const client = new AccountClient(auth.username, auth.password);
      const account = {
        account_sid: auth.username,
        friendly_name: 'test-account',
      };
      // @ts-ignore
      const get = jest.spyOn(client.http, 'get').mockResolvedValue(account);

      const result = await client.get(auth.username);

      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith(expect.stringContaining(auth.username));
      expect(get).toHaveBeenCalledWith(expect.stringContaining('.json'));
      expect(result).toEqual(account);
    });
  });
});
