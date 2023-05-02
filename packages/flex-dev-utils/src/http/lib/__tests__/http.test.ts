/* eslint-disable camelcase */

import FormData from 'form-data';
import { AxiosRequestConfig } from 'axios';
import MockAdapter from 'axios-mock-adapter';

import * as fsScripts from '../../../fs';
import { env } from '../../../env';
import { TwilioApiError, TwilioCliError } from '../../../errors';
import HttpClient, { HttpClientConfig } from '../http';

describe('HttpClient', () => {
  const config: HttpClientConfig = {
    baseURL: 'https://test.com',
    auth: {
      username: 'AC00000000000000000000000000000000',
      password: 'abc123',
    },
  };
  const paths = {
    app: { isTSProject: () => false },
  };

  const payloadStr = 'payload=value';

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should not user-agent', () => {
      const http = new HttpClient({ ...config });

      // @ts-ignore
      expect(http.client.defaults.headers).not.toHaveProperty(HttpClient.UserAgent);
    });

    it('should set user-agent', () => {
      // @ts-ignore
      jest.spyOn(fsScripts, 'getPaths').mockReturnValue(paths);
      const http = new HttpClient({ ...config, setUserAgent: true });

      // @ts-ignore
      expect(http.client.defaults.headers).toHaveProperty(HttpClient.UserAgent);
    });

    it('should set content-type to url-encoded', () => {
      const http = new HttpClient({ ...config });

      // @ts-ignore
      expect(http.client.defaults.headers['Content-Type']).toEqual(HttpClient.ContentTypeUrlEncoded);
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

    it('should support proxy if env is set and config is passed', () => {
      process.env.HTTP_PROXY = 'test';
      const http = new HttpClient({ ...config, supportProxy: true });

      // @ts-ignore
      expect(http.client.defaults.proxy).toEqual(false);
      // @ts-ignore
      expect(http.client.defaults.httpsAgent).not.toBeUndefined();
    });

    it('should not support proxy if env is set but config is not', () => {
      process.env.HTTP_PROXY = 'test';
      const http = new HttpClient({ ...config, supportProxy: false });

      // @ts-ignore
      expect(http.client.defaults.httpsAgent).toBeUndefined();
    });
  });

  describe('getBaseUrl', () => {
    it('should return baseUrl no matter the region if not twilio.com domain', () => {
      expect(HttpClient.getBaseUrl('https://something.else.com')).toEqual('https://something.else.com');
      jest.spyOn(env, 'getRegion').mockReturnValue('stage');
      expect(HttpClient.getBaseUrl('https://something.else.com')).toEqual('https://something.else.com');
    });

    it('should throw a TwilioCliError if invalid region is provided', (done) => {
      try {
        jest.spyOn(env, 'getRegion').mockReturnValue('random');
        HttpClient.getBaseUrl('https://api.twilio.com');
      } catch (e) {
        expect(e).toBeInstanceOf(TwilioCliError);
        done();
      }
    });

    it('should return the correct stage urls', () => {
      jest.spyOn(env, 'getRegion').mockReturnValue('stage');
      const urls = [
        ['https://api.twilio.com', 'https://api.stage.twilio.com'],
        ['https://api-prefix.twilio.com', 'https://api-prefix.stage.twilio.com'],
        ['https://api.twilio.com/v1/service?query=true', 'https://api.stage.twilio.com/v1/service?query=true'],
      ];

      urls.forEach(([url, expected]) => {
        expect(HttpClient.getBaseUrl(url)).toEqual(expected);
      });
    });

    describe('list', () => {
      const http = new HttpClient({ ...config });
      const get = jest.spyOn(http, 'get');

      it('should create no query parameter if no pagination is provided', async () => {
        get.mockResolvedValue({ meta: {}, data: [] });
        const result = await http.list('/the-url', 'data');

        expect(result).toEqual({ meta: {}, data: [] });
        expect(get).toHaveBeenCalledTimes(1);
        expect(get).toHaveBeenCalledWith('/the-url?');
      });

      it('should add one pagination parameter', async () => {
        get.mockResolvedValue({ meta: {}, data: [] });
        const result = await http.list('/the-url', 'data', { pageSize: 5 });

        expect(result).toEqual({ meta: {}, data: [] });
        expect(get).toHaveBeenCalledTimes(1);
        expect(get).toHaveBeenCalledWith('/the-url?PageSize=5');
      });

      it('should add multiple pagination parameters', async () => {
        get.mockResolvedValue({ meta: {}, data: [] });
        const result = await http.list('/the-url', 'data', { page: 1, pageSize: 5 });

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
        const result = await http.list('/the-url', 'data');

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
        const result = await http.list('/the-url', 'data');

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
        const result = await http.list('/the-url', 'plugins');

        expect(result.meta.previous_token).toEqual('321');
        expect(get).toHaveBeenCalledTimes(1);
        expect(get).toHaveBeenCalledWith('/the-url?');
        // @ts-ignore
        expect(result.plugins).toEqual([]);
      });
    });
  });

  describe('getUserAgent', () => {
    let isNode = jest.spyOn(env, 'isNode').mockReturnThis();
    let isCI = jest.spyOn(env, 'isCI').mockReturnThis();

    const getUserAgent = (node: boolean, ci: boolean, options?: HttpClientConfig) => {
      // @ts-ignore
      jest.spyOn(fsScripts, 'getPaths').mockReturnValue(paths);

      isNode = jest.spyOn(env, 'isNode').mockReturnValue(node);
      isCI = jest.spyOn(env, 'isCI').mockReturnValue(ci);

      // @ts-ignore
      return HttpClient.getUserAgent(options || {});
    };

    it('should return default user-agent for node if nothing is set', () => {
      const userAgent = getUserAgent(true, false);

      expect(isNode).toHaveBeenCalledTimes(1);
      expect(isCI).toHaveBeenCalledTimes(1);
      expect(userAgent).toContain('Node.js');
      expect(userAgent).toContain('is_ci/false');
      expect(userAgent).toContain(process.version.slice(1));
      expect(userAgent).toContain(process.platform);
      expect(userAgent).toContain(process.arch);
    });

    it('should return default user-agent for windows if nothing is set', () => {
      const userAgent = getUserAgent(false, false);

      expect(isNode).toHaveBeenCalledTimes(1);
      expect(isCI).toHaveBeenCalledTimes(1);
      expect(userAgent).not.toContain('Node.js');
      expect(userAgent).toContain('is_ci/false');
      expect(userAgent).not.toContain(process.version.slice(1));
    });

    it('should set caller', () => {
      // @ts-ignore
      const userAgent = getUserAgent(true, true, { caller: 'test-caller' });

      expect(userAgent).toContain(`caller/test-caller`);
    });

    it('should set packages', () => {
      // @ts-ignore
      const userAgent = getUserAgent(true, true, { packages: { 'package-a': '1.2.3', 'package-b': '4.5.6' } });

      expect(userAgent).toContain(`package-a/1.2.3`);
      expect(userAgent).toContain(`package-b/4.5.6`);
    });

    it('should not add yarn and npm if they exist', () => {
      const userAgent = getUserAgent(true, true);

      expect(userAgent).not.toContain('yarn');
      expect(userAgent).not.toContain('npm');
    });

    it('should add yarn and npm if they exist', () => {
      process.versions.npm = '1.0.0';
      process.versions.yarn = '2.0.0';
      const userAgent = getUserAgent(true, true);

      expect(userAgent).toContain('yarn');
      expect(userAgent).toContain('npm');
    });

    it('should add shell if exists', () => {
      process.env.SHELL = '/bin/bash';
      const userAgent = getUserAgent(true, true);

      expect(userAgent).toContain('shell/bash');
    });

    it('should add unknown to shell if doesnt exist', () => {
      process.env.SHELL = '';
      const userAgent = getUserAgent(true, true);

      expect(userAgent).toContain('shell/unknown');
    });

    it('should not add shell, npm, yarn, or node if not isNode', () => {
      const userAgent = getUserAgent(false, false);

      expect(userAgent).not.toContain('Node');
      expect(userAgent).not.toContain('yarn');
      expect(userAgent).not.toContain('npm');
      expect(userAgent).not.toContain('shell');
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
      expect(post).toHaveBeenCalledWith('the-uri', { payload: 'the-payload' }, undefined);
    });
  });

  describe('upload', () => {
    it('should upload', async () => {
      const httpClient = new HttpClient(config);
      // @ts-ignore
      const { client } = httpClient;
      // @ts-ignore
      jest.spyOn(httpClient, 'getUploadOptions').mockResolvedValue({ param: '123' });
      const post = jest.spyOn(client, 'post').mockResolvedValue('post-result');
      const formData = new FormData();

      const response = await httpClient.upload('the-uri', formData);

      expect(response).toEqual('post-result');
      expect(post).toHaveBeenCalledTimes(1);
      expect(post).toHaveBeenCalledWith('the-uri', formData, { param: '123' });
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

  describe('useRequestInterceptors', () => {
    it('should all the callback with unmodified data', async () => {
      const req: AxiosRequestConfig = {
        method: 'post',
        data: { payload: 'value' },
      };
      const mockTransformer = jest.fn();
      const httpClient = new HttpClient(config);

      // @ts-ignore
      await httpClient.useRequestInterceptors([HttpClient.transformRequestFormData, mockTransformer])(req);

      expect(mockTransformer).toBeCalledTimes(1);
      expect(mockTransformer).toBeCalledWith(req);
    });

    it('should all the callback with modified data', async () => {
      const req: AxiosRequestConfig = {
        method: 'post',
        data: { payload: 'value' },
        headers: {
          'Content-Type': HttpClient.ContentTypeUrlEncoded,
        },
      };
      const mockTransformer = jest.fn();
      const httpClient = new HttpClient(config);

      // @ts-ignore
      await httpClient.useRequestInterceptors([HttpClient.transformRequestFormData, mockTransformer])(req);

      expect(mockTransformer).toBeCalledTimes(1);
      expect(mockTransformer).toBeCalledWith({ ...req, data: payloadStr });
    });
  });

  describe('transformRequestFormData', () => {
    it('should not transform application/json', async () => {
      const req: AxiosRequestConfig = {
        method: 'post',
        data: { payload: 'value' },
        headers: {
          'Content-Type': 'application/json',
        },
      };
      // @ts-ignore
      const transformed = await HttpClient.transformRequestFormData(req);

      expect(transformed.data).toEqual(req.data);
    });

    it('should transform post parameter if json blob', async () => {
      const req: AxiosRequestConfig = {
        method: 'post',
        data: { payload: 'value' },
        headers: {
          'Content-Type': HttpClient.ContentTypeUrlEncoded,
        },
      };
      // @ts-ignore
      const transformed = await HttpClient.transformRequestFormData(req);

      expect(transformed.data).toEqual(payloadStr);
    });

    it('should transform not transform data-blob', async () => {
      const req: AxiosRequestConfig = {
        method: 'post',
        data: payloadStr,
        headers: {
          'Content-Type': HttpClient.ContentTypeUrlEncoded,
        },
      };
      // @ts-ignore
      const transformed = await HttpClient.transformRequestFormData(req);

      expect(transformed.data).toEqual(payloadStr);
    });

    it('should transform nested array of object', async () => {
      const req: AxiosRequestConfig = {
        method: 'post',
        headers: {
          'Content-Type': HttpClient.ContentTypeUrlEncoded,
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
      const transformed = await HttpClient.transformRequestFormData(req);

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
      const httpClient = new HttpClient(config);

      // @ts-ignore
      expect(httpClient.transformResponse(response)).toEqual('123');
    });
  });

  describe('transformResponseError', () => {
    it('should not transform any rejection if not a twilio error', async (done) => {
      const err = new Error('the-error');
      const httpClient = new HttpClient(config);

      try {
        // @ts-ignore
        await httpClient.transformResponseError(err);
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
      const httpClient = new HttpClient(config);

      try {
        // @ts-ignore
        await httpClient.transformResponseError(err);
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

  describe('concurrency', () => {
    const makeRequest = (httpClient: HttpClient, count: number): Promise<string>[] => {
      const promises: Promise<string>[] = [];
      for (let i = 0; i < count; i++) {
        promises.push(httpClient.get(`url-${i}`));
      }

      return promises;
    };
    const sleep = async () => new Promise((r) => setTimeout(r, 250));

    it('should handle default concurrency', async () => {
      const httpClient = new HttpClient(config);

      // @ts-ignore
      const mockAxios = new MockAdapter(httpClient.client);
      mockAxios.onGet().reply(async (config: any) => Promise.resolve([200, config.url]));
      // @ts-ignore
      const incrementConcurrentRequests = jest.spyOn(httpClient, 'incrementConcurrentRequests');
      // @ts-ignore
      const decrementConcurrentRequests = jest.spyOn(httpClient, 'decrementConcurrentRequests');

      const result = await Promise.all(makeRequest(httpClient, 5));

      expect(result).toEqual(['url-0', 'url-1', 'url-2', 'url-3', 'url-4']);
      expect(incrementConcurrentRequests).toHaveBeenCalledTimes(5);
      expect(decrementConcurrentRequests).toHaveBeenCalledTimes(5);
    });

    it('should queue calls', async () => {
      const httpClient = new HttpClient(config);
      const callbacks = {
        'url-0': jest.fn(),
        'url-1': jest.fn(),
        'url-2': jest.fn(),
        'url-3': jest.fn(),
        'url-4': jest.fn(),
        'url-5': jest.fn(),
        'url-6': jest.fn(),
      };
      const doResolve = {
        'url-0': false,
        'url-1': false,
        'url-2': false,
        'url-3': false,
        'url-4': false,
        'url-5': false,
        'url-6': false,
      };

      // @ts-ignore
      const mockAxios = new MockAdapter(httpClient.client);
      mockAxios.onGet().reply(async (config: any) => {
        callbacks[config.url as string]();
        return new Promise((resolve) => {
          const id = setInterval(() => {
            if (doResolve[config.url as string]) {
              clearInterval(id);
              resolve([200, config.url]);
            }
          }, 10);
        });
      });

      const promises = makeRequest(httpClient, 7);
      await sleep();

      // First, the first 5 should be called, but the other two should not
      expect(callbacks['url-0']).toHaveBeenCalledTimes(1);
      expect(callbacks['url-1']).toHaveBeenCalledTimes(1);
      expect(callbacks['url-2']).toHaveBeenCalledTimes(1);
      expect(callbacks['url-3']).toHaveBeenCalledTimes(1);
      expect(callbacks['url-4']).toHaveBeenCalledTimes(1);
      expect(callbacks['url-5']).not.toHaveBeenCalled();
      expect(callbacks['url-6']).not.toHaveBeenCalled();

      // Now resolve the first promise
      doResolve['url-0'] = true;
      await sleep();

      // Now, the next one should be called
      expect(callbacks['url-0']).toHaveBeenCalledTimes(1);
      expect(callbacks['url-1']).toHaveBeenCalledTimes(1);
      expect(callbacks['url-2']).toHaveBeenCalledTimes(1);
      expect(callbacks['url-3']).toHaveBeenCalledTimes(1);
      expect(callbacks['url-4']).toHaveBeenCalledTimes(1);
      expect(callbacks['url-5']).toHaveBeenCalledTimes(1);
      expect(callbacks['url-6']).not.toHaveBeenCalled();

      // Now resolve the second promise
      doResolve['url-1'] = true;
      await sleep();

      // Now, the next one should be called
      expect(callbacks['url-0']).toHaveBeenCalledTimes(1);
      expect(callbacks['url-1']).toHaveBeenCalledTimes(1);
      expect(callbacks['url-2']).toHaveBeenCalledTimes(1);
      expect(callbacks['url-3']).toHaveBeenCalledTimes(1);
      expect(callbacks['url-4']).toHaveBeenCalledTimes(1);
      expect(callbacks['url-5']).toHaveBeenCalledTimes(1);
      expect(callbacks['url-6']).toHaveBeenCalledTimes(1);

      doResolve['url-2'] = true;
      doResolve['url-3'] = true;
      doResolve['url-4'] = true;
      doResolve['url-5'] = true;
      doResolve['url-6'] = true;
      const result = await Promise.all(promises);

      expect(result).toEqual(['url-0', 'url-1', 'url-2', 'url-3', 'url-4', 'url-5', 'url-6']);
    });

    it('should allow overwrite of default concurrency', async () => {
      const httpClient = new HttpClient({ ...config, maxConcurrentRequests: 7 });

      // @ts-ignore
      const mockAxios = new MockAdapter(httpClient.client);
      mockAxios.onGet().reply(async (config: any) => Promise.resolve([200, config.url]));
      // @ts-ignore
      const incrementConcurrentRequests = jest.spyOn(httpClient, 'incrementConcurrentRequests');
      // @ts-ignore
      const decrementConcurrentRequests = jest.spyOn(httpClient, 'decrementConcurrentRequests');

      const result = await Promise.all(makeRequest(httpClient, 7));

      expect(result).toEqual(['url-0', 'url-1', 'url-2', 'url-3', 'url-4', 'url-5', 'url-6']);
      expect(incrementConcurrentRequests).toHaveBeenCalledTimes(7);
      expect(decrementConcurrentRequests).toHaveBeenCalledTimes(7);
    });
  });

  describe('download', () => {
    it('should call request', async () => {
      const httpClient = new HttpClient({ ...config });
      const result = { data: 'the-data' };
      const writeFileSync = jest.spyOn(fsScripts.default, 'writeFileSync').mockReturnValue(undefined);
      const mkdirpSync = jest.spyOn(fsScripts, 'mkdirpSync').mockReturnValue(undefined);
      // @ts-ignore
      const request = jest.spyOn(httpClient.client, 'request').mockResolvedValue(result);

      await httpClient.download('the-url', 'the-output');

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith({
        method: 'GET',
        responseType: 'arraybuffer',
        url: 'the-url',
      });
      expect(mkdirpSync).toHaveBeenCalledTimes(1);
      expect(writeFileSync).toHaveBeenCalledTimes(1);
      expect(writeFileSync).toHaveBeenCalledWith('the-output', expect.anything());

      writeFileSync.mockRestore();
      mkdirpSync.mockRestore();
      request.mockRestore();
    });
  });

  describe('getUploadOptions', () => {
    it('should return config without adapter', async () => {
      const httpClient = new HttpClient(config);
      const form = new FormData();

      // @ts-ignore
      const options = await httpClient.getUploadOptions(form);

      expect(options.headers['Content-Type']).toEqual(form.getHeaders()['content-type']);
      expect(options.headers['content-type']).toEqual(form.getHeaders()['content-type']);
      expect('adapter' in options).toEqual(false);
    });

    it('should return config adapter', async () => {
      jest.spyOn(env, 'isDebug').mockReturnValue(true);
      const httpClient = new HttpClient(config);
      const form = new FormData();

      // @ts-ignore
      const options = await httpClient.getUploadOptions(form);

      expect(options.headers['Content-Type']).toEqual(form.getHeaders()['content-type']);
      expect(options.headers['content-type']).toEqual(form.getHeaders()['content-type']);
      expect('adapter' in options).toEqual(true);
    });

    it('should throw an error if no auth is provided', async (done) => {
      const httpClient = new HttpClient({ baseURL: '' });
      const form = new FormData();

      try {
        // @ts-ignore
        await httpClient.getUploadOptions(form);
      } catch (e) {
        expect(e).toBeInstanceOf(TwilioCliError);
        done();
      }
    });
  });

  describe('getFormDataSize', () => {
    it('should get data size of empty form', async () => {
      const httpClient = new HttpClient(config);
      const form = new FormData();
      // @ts-ignore
      const length = await httpClient.getFormDataSize(form);
      expect(length).toEqual(0);
    });

    it('should get data size of empty form', async () => {
      const httpClient = new HttpClient(config);
      const form = new FormData();
      form.append('someKey', 'someValue');

      // @ts-ignore
      const length = await httpClient.getFormDataSize(form);
      expect(length).toEqual(171);
    });
  });
});
