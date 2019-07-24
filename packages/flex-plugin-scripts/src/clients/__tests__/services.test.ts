import ServiceClient from '../services';

describe('ServiceClient', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV };
  });

  describe('getBaseUrl', () => {
    it('should get prod baseUrl', () => {
      const baseUrl = ServiceClient.getBaseUrl();

      expect(baseUrl).toEqual('https://serverless.twilio.com/v1');
    });

    it('should get dev baseUrl', () => {
      process.env.TWILIO_SERVERLESS_REALM = 'dev';
      const baseUrl = ServiceClient.getBaseUrl();

      expect(baseUrl).toEqual('https://serverless.dev.twilio.com/v1');
    });

    it('should throw error if invalid realm is provided', (done) => {
      try {
        process.env.TWILIO_SERVERLESS_REALM = 'invalid';
        ServiceClient.getBaseUrl();
      } catch (e) {
        done();
      }
    });
  });
});
