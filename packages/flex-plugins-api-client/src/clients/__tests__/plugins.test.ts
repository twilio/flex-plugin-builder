import { TwilioApiError } from '@twilio/flex-plugins-utils-exception';

import PluginsClient from '../plugins';
import PluginServiceHttpClient from '../client';

describe('PluginsClient', () => {
  const httpClient = new PluginServiceHttpClient('username', 'password');
  const list = jest.spyOn(httpClient, 'list');
  const get = jest.spyOn(httpClient, 'get');
  const post = jest.spyOn(httpClient, 'post');
  const client = new PluginsClient(httpClient);

  const pluginInstanceUri = 'Plugins/the-name';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should list plugins without pagination', async () => {
    // @ts-ignore
    list.mockResolvedValue('list');

    const result = await client.list();

    expect(result).toEqual('list');
    expect(list).toHaveBeenCalledTimes(1);
    expect(list).toHaveBeenCalledWith('Plugins', 'plugins', undefined);
  });

  it('should list plugins with pagination', async () => {
    // @ts-ignore
    list.mockResolvedValue('list');

    const result = await client.list({ page: 1 });

    expect(result).toEqual('list');
    expect(list).toHaveBeenCalledTimes(1);
    expect(list).toHaveBeenCalledWith('Plugins', 'plugins', { page: 1 });
  });

  it('should get plugin', async () => {
    get.mockResolvedValue('item');

    const result = await client.get('pluginId');

    expect(result).toEqual('item');
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('Plugins/pluginId', { cacheable: true });
  });

  it('should update plugin', async () => {
    post.mockResolvedValue('updated');

    const payload = { FriendlyName: 'the-name' };
    const result = await client.update('pluginId', payload);

    expect(result).toEqual('updated');
    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith('Plugins/pluginId', payload);
  });

  it('should create plugin', async () => {
    post.mockResolvedValue('created');

    const payload = { UniqueName: 'the-name' };
    const result = await client.create(payload);

    expect(result).toEqual('created');
    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith('Plugins', payload);
  });

  it('should archive plugin', async () => {
    post.mockResolvedValue('item');

    const result = await client.archive('pluginId');

    expect(result).toEqual('item');
    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith('Plugins/pluginId/Archive', {});
  });

  describe('upsert', () => {
    it('should fetch existing plugin without update', async () => {
      get.mockResolvedValue('existing-pluginA');

      const payload = { UniqueName: 'the-name' };
      const result = await client.upsert(payload);

      expect(result).toEqual('existing-pluginA');
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith(pluginInstanceUri, { cacheable: true });
      expect(post).not.toHaveBeenCalled();
    });

    it('should fetch and update existing plugin', async () => {
      get.mockResolvedValue('existing-plugin');
      post.mockResolvedValue('updated-existing-plugin');

      const updatePayload = { FriendlyName: 'friendly-name', Description: 'the-description' };
      const payload = { UniqueName: 'the-name', ...updatePayload };
      const result = await client.upsert(payload);

      expect(result).toEqual('updated-existing-plugin');
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith(pluginInstanceUri, { cacheable: true });
      expect(post).toHaveBeenCalledTimes(1);
      expect(post).toHaveBeenCalledWith(pluginInstanceUri, updatePayload);
    });

    it('should create a new plugin', async () => {
      get.mockRejectedValue(new TwilioApiError(404, 'message', 404, 'info'));
      post.mockResolvedValue('created-plugin');

      const payload = { UniqueName: 'the-name' };
      const result = await client.upsert(payload);

      expect(result).toEqual('created-plugin');
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith(pluginInstanceUri, { cacheable: true });
      expect(post).toHaveBeenCalledTimes(1);
      expect(post).toHaveBeenCalledWith('Plugins', payload);
    });

    it('should throw an exception', async (done) => {
      const exception = new TwilioApiError(400, 'message', 400, 'info');
      get.mockRejectedValue(exception);

      try {
        const payload = { UniqueName: 'the-name' };
        await client.upsert(payload);
      } catch (err) {
        expect(err).toBeInstanceOf(TwilioApiError);
        expect(err).toEqual(exception);

        expect(get).toHaveBeenCalledTimes(1);
        expect(get).toHaveBeenCalledWith(pluginInstanceUri, { cacheable: true });
        expect(post).not.toHaveBeenCalled();
        done();
      }
    });
  });
});
