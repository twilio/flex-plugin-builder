import HttpClient, { HttpConfig } from '../http';
import { clone } from 'flex-dev-utils/dist/lodash';

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
});
