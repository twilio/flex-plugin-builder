import { AuthConfig } from 'flex-dev-utils/dist/credentials';
import BaseClient from '../baseClient';

describe('BaseClient', () => {
  const credential = {
    accountSid: 'AC00000000000000000000000000000000',
    authToken: 'abc',
  };
  const testBaseUrl = 'testBaseUrl';

  class Test extends BaseClient {
    constructor(authConfig: AuthConfig, baseUrl: string) {
      super(authConfig, baseUrl);
    }

    public getConfig = () => this.config;
  }

  describe('constructor', () => {
    it('should set the config correctly', () => {
      const client = new Test(credential, testBaseUrl);

      expect(client.getConfig().baseURL).toEqual(testBaseUrl);
      expect(client.getConfig().auth).toEqual(credential);
      expect(client.getConfig().exitOnRejection).toBeTruthy();
    });
  });
});
