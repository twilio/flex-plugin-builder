import HttpClient, { HttpConfig } from '../http';

describe('HttpClient', () => {
  const config: HttpConfig = {
    baseURL: 'https://test.com',
    auth: {
      accountSid: 'AC00000000000000000000000000000000',
      authToken: 'abc123',
    },
  };

  beforeEach(() => {
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
