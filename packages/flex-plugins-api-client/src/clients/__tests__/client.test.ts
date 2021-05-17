import { HttpClient } from 'flex-plugin-utils-http';
import { env } from 'flex-plugins-utils-env';

import PluginServiceHttp from '../client';

jest.mock('flex-plugins-utils-logger');
jest.mock('flex-plugin-utils-http');

describe('PluginServiceHttp', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('constructor', () => {
    // eslint-disable-next-line  global-require, @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const pkg = require('../../../package.json');
    const packages = {
      [pkg.name]: pkg.version,
    };

    it('should pass caller', () => {
      // eslint-disable-next-line no-new
      new PluginServiceHttp('username', 'password', { caller: 'test-caller' });

      expect(HttpClient).toHaveBeenCalledTimes(1);
      expect(HttpClient).toHaveBeenCalledWith(expect.objectContaining({ caller: 'test-caller' }));
    });

    it('should pass default caller', () => {
      // eslint-disable-next-line no-new
      new PluginServiceHttp('username', 'password');

      expect(HttpClient).toHaveBeenCalledTimes(1);
      expect(HttpClient).toHaveBeenCalledWith(expect.objectContaining({ caller: 'flex-plugins-api-client' }));
    });

    it('should pass default packages', () => {
      // eslint-disable-next-line no-new
      new PluginServiceHttp('username', 'password');

      expect(HttpClient).toHaveBeenCalledTimes(1);
      expect(HttpClient).toHaveBeenCalledWith(expect.objectContaining({ packages }));
    });

    it('should pass provided packages', () => {
      const extraPackages = {
        'sample-package': '1.2.3',
        'another-package': '4.5.6',
      };
      // eslint-disable-next-line no-new
      new PluginServiceHttp('username', 'password', { packages: extraPackages });

      expect(HttpClient).toHaveBeenCalledTimes(1);
      expect(HttpClient).toHaveBeenCalledWith(expect.objectContaining({ packages: { ...packages, ...extraPackages } }));
    });
  });

  describe('getRealm', () => {
    it('should return the realm passed to it', () => {
      jest.spyOn(env, 'getRealm');

      // @ts-ignore
      expect(PluginServiceHttp.getRealm('stage')).toEqual('.stage');
      expect(env.getRealm).not.toHaveBeenCalled();
    });

    it('should return prod realm if no realm provided', () => {
      // @ts-ignore
      jest.spyOn(env, 'getRealm').mockReturnValue('');

      // @ts-ignore
      expect(PluginServiceHttp.getRealm()).toEqual('');
    });

    it('should return prod realm if invalid realm provided', () => {
      // @ts-ignore
      jest.spyOn(env, 'getRealm').mockReturnValue('foo');

      // @ts-ignore
      expect(PluginServiceHttp.getRealm()).toEqual('');
    });

    it('should return dev realm', () => {
      jest.spyOn(env, 'getRealm').mockReturnValue('dev');

      // @ts-ignore
      expect(PluginServiceHttp.getRealm()).toEqual('.dev');
    });

    it('should return stage realm', () => {
      jest.spyOn(env, 'getRealm').mockReturnValue('stage');

      // @ts-ignore
      expect(PluginServiceHttp.getRealm()).toEqual('.stage');
    });
  });

  describe('list', () => {
    const client = new PluginServiceHttp('username', 'password');
    const get = jest.spyOn(client, 'get');

    it('should create no query parameter if no pagination is provided', async () => {
      get.mockResolvedValue({ meta: {}, data: [] });
      const result = await client.list('/the-url', 'data');

      expect(result).toEqual({ meta: {}, data: [] });
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('/the-url?');
    });

    it('should add one pagination parameter', async () => {
      get.mockResolvedValue({ meta: {}, data: [] });
      const result = await client.list('/the-url', 'data', { pageSize: 5 });

      expect(result).toEqual({ meta: {}, data: [] });
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('/the-url?PageSize=5');
    });

    it('should add multiple pagination parameters', async () => {
      get.mockResolvedValue({ meta: {}, data: [] });
      const result = await client.list('/the-url', 'data', { page: 1, pageSize: 5 });

      expect(result).toEqual({ meta: {}, data: [] });
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('/the-url?Page=1&PageSize=5');
    });

    it('should return meta with next token', async () => {
      get.mockResolvedValue({
        meta: {
          next_page_url: 'https://api.twilio.com/Data?PageToken=123',
        },
        data: [],
      });
      const result = await client.list('/the-url', 'data');

      expect(result.meta.next_token).toEqual('123');
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('/the-url?');
    });

    it('should return meta with previous token', async () => {
      get.mockResolvedValue({
        meta: {
          previous_page_url: 'https://api.twilio.com/Data?PageToken=321',
        },
        data: [],
      });
      const result = await client.list('/the-url', 'data');

      expect(result.meta.previous_token).toEqual('321');
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('/the-url?');
    });

    it('should change response key with provided key', async () => {
      get.mockResolvedValue({
        meta: {
          previous_token: '321',
        },
        results: [],
      });
      const result = await client.list('/the-url', 'plugins');

      expect(result.meta.previous_token).toEqual('321');
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('/the-url?');
      // @ts-ignore
      expect(result.plugins).toEqual([]);
    });
  });
});
