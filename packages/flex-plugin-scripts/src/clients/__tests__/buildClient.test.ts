import { AuthConfig } from 'flex-dev-utils/dist/credentials';
import BaseClient, { BaseClientOptions } from '../baseClient';

describe('BaseClient', () => {
  const credential = {
    accountSid: 'AC00000000000000000000000000000000',
    authToken: 'abc',
  };
  const testBaseUrl = 'testBaseUrl';

  class Test extends BaseClient {
    constructor(authConfig: AuthConfig, baseUrl: string, options?: BaseClientOptions) {
      super(authConfig, baseUrl, options);
    }

    public getConfig = () => this.config;
  }

  const expectConfig = (client: Test) => {
    expect(client.getConfig().baseURL).toEqual(testBaseUrl);
    expect(client.getConfig().auth).toEqual(credential);
    expect(client.getConfig().exitOnRejection).toBeTruthy();
  };

  describe('constructor', () => {
    it('should set the config correctly', () => {
      const client = new Test(credential, testBaseUrl);

      expectConfig(client);
    });

    it('should pass contentType as well', () => {
      const client = new Test(credential, testBaseUrl, {contentType: 'application/json'});

      expectConfig(client);
      expect(client.getConfig().contentType).toEqual('application/json');
    });
  });

  describe('getBaseUrl', () => {
    it('should get prod baseUrl', () => {
      const baseUrl = BaseClient.getBaseUrl('foo', 'v1');

      expect(baseUrl).toEqual('https://foo.twilio.com/v1');
    });

    it('should get dev baseUrl', () => {
      process.env.REALM = 'dev';
      const baseUrl = BaseClient.getBaseUrl('bar', 'v2');

      expect(baseUrl).toEqual('https://bar.dev.twilio.com/v2');
    });

    it('should throw error if invalid realm is provided', (done) => {
      try {
        process.env.REALM = 'invalid';
        BaseClient.getBaseUrl('foo', 'v1');
      } catch (e) {
        done();
      }
    });
  });
});
