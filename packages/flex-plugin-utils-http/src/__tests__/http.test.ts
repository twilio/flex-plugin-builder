/* eslint-disable camelcase */
import { AxiosRequestConfig } from 'axios';
import { env } from 'flex-plugins-utils-env';
import { TwilioApiError } from 'flex-plugins-utils-exception';

import HttpClient, { HttpConfig } from '../http';

describe('HttpClient', () => {
  const config: HttpConfig = {
    baseURL: 'https://test.com',
    auth: {
      username: 'AC00000000000000000000000000000000',
      password: 'abc123',
    },
  };

  const payloadStr = 'payload=value';

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('constructor', () => {
    it('should not user-agent', () => {
      const http = new HttpClient({ ...config });

      // @ts-ignore
      expect(http.client.defaults.headers).not.toHaveProperty(HttpClient.UserAgent);
    });

    it('should set user-agent', () => {
      const http = new HttpClient({ ...config, setUserAgent: true });

      // @ts-ignore
      expect(http.client.defaults.headers).toHaveProperty(HttpClient.UserAgent);
    });

    it('should set content-type to url-encoded', () => {
      const http = new HttpClient({ ...config });

      // @ts-ignore
      expect(http.client.defaults.headers['Content-Type']).toEqual(HttpClient.ContentType);
    });

    it('should not set auth when not defined', () => {
      const http = new HttpClient({ ...config, auth: undefined });

      // @ts-ignore
      expect(http.client.defaults.auth).toEqual(undefined);
    });

    it('should set customs headers ', () => {
      const http = new HttpClient({ ...config, headers: { custom: 'test' } });

      // @ts-ignore
      expect(http.client.defaults.headers.custom).toEqual('test');
    });
  });

  describe('getUserAgent', () => {
    // eslint-disable-next-line  global-require, @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const pkg = require('../../package.json');

    it('should return default user-agent for node if nothing is set', () => {
      const isNode = jest.spyOn(env, 'isNode').mockReturnValue(true);

      // @ts-ignore
      const userAgent = HttpClient.getUserAgent({});

      expect(isNode).toHaveBeenCalledTimes(1);
      expect(userAgent).toContain('Node.js');
      expect(userAgent).toContain(process.version.slice(1));
      expect(userAgent).toContain(process.platform);
      expect(userAgent).toContain(process.arch);
      expect(userAgent).toContain(`${pkg.name}/${pkg.version}`);
    });

    it('should return default user-agent for windows if nothing is set', () => {
      const isNode = jest.spyOn(env, 'isNode').mockReturnValue(false);

      // @ts-ignore
      const userAgent = HttpClient.getUserAgent({});

      expect(isNode).toHaveBeenCalledTimes(1);
      expect(userAgent).not.toContain('Node.js');
      expect(userAgent).not.toContain(process.version.slice(1));
      expect(userAgent).toContain(`${pkg.name}/${pkg.version}`);
    });

    it('should set caller', () => {
      jest.spyOn(env, 'isNode').mockReturnValue(true);

      // @ts-ignore
      const userAgent = HttpClient.getUserAgent({ caller: 'test-caller' });
      expect(userAgent).toContain(`caller/test-caller`);
    });

    it('should set packages', () => {
      jest.spyOn(env, 'isNode').mockReturnValue(true);

      // @ts-ignore
      const userAgent = HttpClient.getUserAgent({
        packages: {
          'package-a': '1.2.3',
          'package-b': '4.5.6',
        },
      });
      expect(userAgent).toContain(`package-a/1.2.3`);
      expect(userAgent).toContain(`package-b/4.5.6`);
    });
  });

  describe('get', () => {
    it('should call get', async () => {
      const httpClient = new HttpClient(config);
      // @ts-ignore
      const { client } = httpClient;
      const get = jest.spyOn(client, 'get').mockResolvedValue('get-result');

      const response = await httpClient.get('the-uri');

      expect(response).toEqual('get-result');
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('the-uri', {});
    });
  });

  describe('post', () => {
    it('should post', async () => {
      const httpClient = new HttpClient(config);
      // @ts-ignore
      const { client } = httpClient;
      const post = jest.spyOn(client, 'post').mockResolvedValue('post-result');

      const response = await httpClient.post('the-uri', { payload: 'the-payload' });

      expect(response).toEqual('post-result');
      expect(post).toHaveBeenCalledTimes(1);
      expect(post).toHaveBeenCalledWith('the-uri', { payload: 'the-payload' });
    });
  });

  describe('delete', () => {
    it('should delete', async () => {
      const httpClient = new HttpClient(config);
      // @ts-ignore
      const { client } = httpClient;
      const del = jest.spyOn(client, 'delete').mockResolvedValue(null);

      const result = await httpClient.delete('the-uri');

      expect(result).toBeNull();
      expect(del).toHaveBeenCalledTimes(1);
      expect(del).toHaveBeenCalledWith('the-uri');
    });
  });

  describe('isTwilioError', () => {
    it('should return true if Twilio Error', () => {
      const err = {
        isAxiosError: true,
        response: {
          data: {
            more_info: 'the-info',
          },
        },
      };
      // @ts-ignore
      expect(HttpClient.isTwilioError(err)).toEqual(true);
    });

    it('should return false', () => {
      // @ts-ignore
      expect(HttpClient.isTwilioError(null)).toEqual(false);
      // @ts-ignore
      expect(HttpClient.isTwilioError({})).toEqual(false);
      // @ts-ignore
      expect(HttpClient.isTwilioError(new Error())).toEqual(false);
      // @ts-ignore
      expect(HttpClient.isTwilioError({ isAxiosError: false })).toEqual(false);
      // @ts-ignore
      expect(HttpClient.isTwilioError({ isAxiosError: true, response: {} })).toEqual(false);
    });
  });

  describe('transformRequest', () => {
    it('should all the callback with unmodified data', () => {
      const req: AxiosRequestConfig = {
        method: 'post',
        data: { payload: 'value' },
      };
      const mockTransformer = jest.fn();

      // @ts-ignore
      HttpClient.transformRequest([HttpClient.transformRequestFormData, mockTransformer])(req);

      expect(mockTransformer).toBeCalledTimes(1);
      expect(mockTransformer).toBeCalledWith(req);
    });

    it('should all the callback with modified data', () => {
      const req: AxiosRequestConfig = {
        method: 'post',
        data: { payload: 'value' },
        headers: {
          'Content-Type': HttpClient.ContentType,
        },
      };
      const mockTransformer = jest.fn();

      // @ts-ignore
      HttpClient.transformRequest([HttpClient.transformRequestFormData, mockTransformer])(req);

      expect(mockTransformer).toBeCalledTimes(1);
      expect(mockTransformer).toBeCalledWith({ ...req, data: payloadStr });
    });
  });

  describe('transformRequestFormData', () => {
    it('should not transform application/json', () => {
      const req: AxiosRequestConfig = {
        method: 'post',
        data: { payload: 'value' },
        headers: {
          'Content-Type': 'application/json',
        },
      };
      // @ts-ignore
      const transformed = HttpClient.transformRequestFormData(req);

      expect(transformed.data).toEqual(req.data);
    });

    it('should transform post parameter if json blob', () => {
      const req: AxiosRequestConfig = {
        method: 'post',
        data: { payload: 'value' },
        headers: {
          'Content-Type': HttpClient.ContentType,
        },
      };
      // @ts-ignore
      const transformed = HttpClient.transformRequestFormData(req);

      expect(transformed.data).toEqual(payloadStr);
    });

    it('should transform not transform data-blob', () => {
      const req: AxiosRequestConfig = {
        method: 'post',
        data: payloadStr,
        headers: {
          'Content-Type': HttpClient.ContentType,
        },
      };
      // @ts-ignore
      const transformed = HttpClient.transformRequestFormData(req);

      expect(transformed.data).toEqual(payloadStr);
    });

    it('should transform nested array of object', () => {
      const req: AxiosRequestConfig = {
        method: 'post',
        headers: {
          'Content-Type': HttpClient.ContentType,
        },
        data: {
          payload: 'value',
          arr: ['item1', 'item2'],
          objArr: [
            { name: 'item1', phase: 0 },
            { name: 'item2', phase: 1 },
          ],
        },
      };

      // @ts-ignore
      const transformed = HttpClient.transformRequestFormData(req);

      expect(transformed.data).toEqual(
        'payload=value&arr=item1&arr=item2&objArr={"name":"item1","phase":0}&objArr={"name":"item2","phase":1}',
      );
    });
  });

  describe('transformResponse', () => {
    it('should transform response', () => {
      const response = {
        data: '123',
        config: {},
        request: {},
      };
      // @ts-ignore
      expect(HttpClient.transformResponse(response)).toEqual('123');
    });
  });

  describe('transformResponseError', () => {
    it('should not transform any rejection if not a twilio error', async (done) => {
      const err = new Error('the-error');
      try {
        // @ts-ignore
        await HttpClient.transformResponseError(err);
      } catch (e) {
        expect(e).toEqual(err);
        done();
      }
    });

    it('should not transform rejection to twilio error', async (done) => {
      const err = {
        isAxiosError: true,
        response: {
          data: {
            code: 123,
            message: 'the-message',
            more_info: 'more-info',
            status: 321,
          },
        },
      };

      try {
        // @ts-ignore
        await HttpClient.transformResponseError(err);
      } catch (e) {
        expect(e).toBeInstanceOf(TwilioApiError);
        expect((e as TwilioApiError).code).toEqual(err.response.data.code);
        expect((e as TwilioApiError).message).toEqual(err.response.data.message);
        expect((e as TwilioApiError).moreInfo).toEqual(err.response.data.more_info);
        expect((e as TwilioApiError).status).toEqual(err.response.data.status);
        done();
      }
    });
  });

  describe('getRequestOption', () => {
    it('should return empty object', () => {
      const httpClient = new HttpClient(config);

      // @ts-ignore
      expect(httpClient.getRequestOption()).toEqual({});
    });

    it('should return default maxAge', () => {
      const httpClient = new HttpClient(config);

      // @ts-ignore
      const maxAge = httpClient.cacheAge;
      // @ts-ignore
      expect(httpClient.getRequestOption({ cacheable: true })).toEqual({ cache: { maxAge } });
    });

    it('should return requested maxAge', () => {
      const httpClient = new HttpClient(config);

      // @ts-ignore
      expect(httpClient.getRequestOption({ cacheable: true, cacheAge: 123 })).toEqual({ cache: { maxAge: 123 } });
    });
  });
});
