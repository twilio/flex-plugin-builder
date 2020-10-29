import HttpClient, { HttpConfig } from '../http';
import axios, { MockAdapter } from 'flex-dev-utils/dist/axios';
import { clone } from 'flex-dev-utils/dist/lodash';
import { env } from 'flex-dev-utils';
import FormData from 'form-data';

describe('HttpClient', () => {
  const CONFIG: HttpConfig = {
    baseURL: 'https://test.com',
    auth: {
      username: 'AC00000000000000000000000000000000',
      password: 'abc123',
    },
    userAgent: '007',
  };
  let config: HttpConfig;

  beforeEach(() => {
    config = clone(CONFIG);
    jest.resetAllMocks();
    jest.resetModules();
  });

  describe('getContentType', () => {
    it('should return javascript', () => {
      const contentType = HttpClient.getContentType('foo.js');
      expect(contentType).toEqual('application/javascript');
    });

    it('should return javascript even if route is multiple dots', () => {
      const contentType = HttpClient.getContentType('foo.bar.js');
      expect(contentType).toEqual('application/javascript');
    });

    it('should return json for map files', () => {
      const contentType = HttpClient.getContentType('foo.map');
      expect(contentType).toEqual('application/json');
    });

    it('should return json for map files for multi dots', () => {
      const contentType = HttpClient.getContentType('foo.js.map');
      expect(contentType).toEqual('application/json');
    });

    it('should return octet for unknown extensions', () => {
      const contentType = HttpClient.getContentType('foo.bar');
      expect(contentType).toEqual('application/octet-stream');
    });
  });

  describe('constructor', () => {
    it('should set contentType as application/x-www-form-urlencoded', () => {
      const http = new HttpClient(config);

      // @ts-ignore
      expect(http.jsonPOST).toBeFalsy();
      // @ts-ignore
      expect(http.client.defaults.headers['Content-Type'])
        .toEqual('application/x-www-form-urlencoded');
    });

    it('should set contentType as application/json', () => {
      config.contentType = 'application/json';
      const http = new HttpClient(config);

      // @ts-ignore
      expect(http.jsonPOST).toBeTruthy();
      // @ts-ignore
      expect(http.client.defaults.headers['Content-Type'])
        .toEqual('application/json');
    });

    it('should set user agent when defined', () => {
      const http = new HttpClient(config);
      // @ts-ignore
      expect(http.client.defaults.headers['User-Agent'])
        .toEqual('007');
    });

    it('should handle no user agent', () => {
      config.userAgent = undefined;
      const http = new HttpClient(config);
      // @ts-ignore
      expect(http.client.defaults.headers['User-Agent'])
        .toBeUndefined();
    });
  });

  describe('get', () => {
    it('should call get', async () => {
      const httpClient = new HttpClient(config);
      // @ts-ignore
      const client = httpClient.client;
      const get = jest
        .spyOn(client, 'get')
        .mockResolvedValue({ data: 'the-result' });

      const response = await httpClient.get('the-uri');

      expect(response).toEqual('the-result');
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('the-uri');
    });
  });

  describe('upload', () => {
    let mockAxios: MockAdapter;

    beforeEach(() => {
      mockAxios = new MockAdapter(axios);
    });

    it('should upload content', async () => {
      const resp = { success: true };
      const httpClient = new HttpClient(config);
      mockAxios.onPost().reply(() => Promise.resolve([200, resp]));
      const post = jest.spyOn(axios, 'post');

      const form = new FormData();
      form.append('property1', 'value1');

      const result = await httpClient.upload('/upload', form);
      const options = {
        headers: form.getHeaders(),
        auth: config.auth,
      };

      expect(post).toHaveBeenCalledTimes(1)
      expect(post).toHaveBeenCalledWith('/upload', form, options)
      expect(result).toEqual(resp);
    });
  });

  describe('post', () => {
    it('should post as application/x-www-form-urlencoded', async () => {
      const httpClient = new HttpClient(config);
      // @ts-ignore
      const client = httpClient.client;
      const post = jest
        .spyOn(client, 'post')
        .mockResolvedValue({ data: 'the-result' });

      const response = await httpClient.post('the-uri', {payload: 'the-payload'});

      expect(response).toEqual('the-result');
      expect(post).toHaveBeenCalledTimes(1);
      expect(post).toHaveBeenCalledWith('the-uri', 'payload=the-payload');
    });

    it('should post as application/json', async () => {
      config.contentType = 'application/json';
      const httpClient = new HttpClient(config);
      // @ts-ignore
      const client = httpClient.client;
      const post = jest
        .spyOn(client, 'post')
        .mockResolvedValue({ data: 'the-result' });

      const response = await httpClient.post('the-uri', {payload: 'the-payload'});

      expect(response).toEqual('the-result');
      expect(post).toHaveBeenCalledTimes(1);
      expect(post).toHaveBeenCalledWith('the-uri', {payload: 'the-payload'});
    });
  });

  describe('list', () => {
    it('list should call get method', async () => {
      const client = new HttpClient(config);
      const data = { result: 'the-result' };
      const get = jest
        .spyOn(client, 'get')
        .mockResolvedValue([data]);

      const result = await client.list('the-uri');

      expect(result).toEqual([data]);
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith('the-uri');
    });
  });

  describe('delete', () => {
    it('should delete', async () => {
      const httpClient = new HttpClient(config);
      // @ts-ignore
      const client = httpClient.client;
      const del = jest
        .spyOn(client, 'delete')
        .mockResolvedValue(null);

      const result = await httpClient.delete('the-uri');

      expect(result).toBeNull();
      expect(del).toHaveBeenCalledTimes(1);
      expect(del).toHaveBeenCalledWith('the-uri');
    });
  });

  describe.only('getUploadOptions', () => {
    it('should return config without adapter', async () => {
      const httpClient = new HttpClient(config);
      const form = new FormData();

      // @ts-ignore
      const options = await httpClient.getUploadOptions(form);

      expect(options.headers).toEqual(form.getHeaders());
      expect(options.auth).toEqual(config.auth);
      expect('adapter' in options).toEqual(false);
    });

    it('should return config adapter', async () => {
      jest.spyOn(env, 'isDebug').mockReturnValue(true);
      const httpClient = new HttpClient(config);
      const form = new FormData();

      // @ts-ignore
      const options = await httpClient.getUploadOptions(form);

      expect(options.headers).toEqual(form.getHeaders());
      expect(options.auth).toEqual(config.auth);
      expect('adapter' in options).toEqual(true);
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
