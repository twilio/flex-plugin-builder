import address from 'address';

import * as urls from '../urls';

jest.mock('address');

describe('urls', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('getDefaultPort', () => {
    it('should return default if no port is provided', () => {
      expect(urls.getDefaultPort()).toEqual(urls.DEFAULT_PORT);
    });

    it('should return default if port is an empty string', () => {
      expect(urls.getDefaultPort('')).toEqual(urls.DEFAULT_PORT);
    });

    it('should return default if port is not a number string', () => {
      expect(urls.getDefaultPort('abc')).toEqual(urls.DEFAULT_PORT);
    });

    it('should return port passed', () => {
      expect(urls.getDefaultPort('123')).toEqual(123);
    });

    it('should return int from float port passed', () => {
      expect(urls.getDefaultPort('123.456')).toEqual(123);
    });
  });

  describe('getLocalAndNetworkUrls', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
      process.env = { ...OLD_ENV };
      delete process.env.DOMAIN; // Ensure clean state
    });

    it('should return http with localhost (default)', () => {
      const ip = jest.spyOn(address, 'ip').mockReturnValue('192.0.0.0');
      const result = urls.getLocalAndNetworkUrls(1234);

      expect(result.local.host).toEqual('0.0.0.0');
      expect(result.local.port).toEqual(1234);
      expect(result.local.url).toEqual('http://localhost:1234/');

      expect(result.network.host).toEqual('192.0.0.0');
      expect(result.network.port).toEqual(1234);
      expect(result.network.url).toEqual('http://192.0.0.0:1234/');

      ip.mockRestore();
    });

    it('should return http with custom domain', () => {
      process.env.DOMAIN = 'flex.local.com';
      const ip = jest.spyOn(address, 'ip').mockReturnValue('192.0.0.0');
      const result = urls.getLocalAndNetworkUrls(1234);

      expect(result.local.host).toEqual('0.0.0.0');
      expect(result.local.port).toEqual(1234);
      expect(result.local.url).toEqual('http://flex.local.com:1234/');

      expect(result.network.host).toEqual('192.0.0.0');
      expect(result.network.port).toEqual(1234);
      expect(result.network.url).toEqual('http://192.0.0.0:1234/');

      ip.mockRestore();
    });

    it('should return https with localhost (default)', () => {
      process.env.HTTPS = 'true';
      const ip = jest.spyOn(address, 'ip').mockReturnValue('192.0.0.0');
      const result = urls.getLocalAndNetworkUrls(1234);

      expect(result.local.host).toEqual('0.0.0.0');
      expect(result.local.port).toEqual(1234);
      expect(result.local.url).toEqual('https://localhost:1234/');

      expect(result.network.host).toEqual('192.0.0.0');
      expect(result.network.port).toEqual(1234);
      expect(result.network.url).toEqual('https://192.0.0.0:1234/');

      ip.mockRestore();
    });

    it('should return https with custom domain', () => {
      process.env.HTTPS = 'true';
      process.env.DOMAIN = 'secure.local.dev';
      const ip = jest.spyOn(address, 'ip').mockReturnValue('192.0.0.0');
      const result = urls.getLocalAndNetworkUrls(1234);

      expect(result.local.host).toEqual('0.0.0.0');
      expect(result.local.port).toEqual(1234);
      expect(result.local.url).toEqual('https://secure.local.dev:1234/');

      expect(result.network.host).toEqual('192.0.0.0');
      expect(result.network.port).toEqual(1234);
      expect(result.network.url).toEqual('https://192.0.0.0:1234/');

      ip.mockRestore();
    });
  });
});
