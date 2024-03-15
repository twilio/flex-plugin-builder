import ConfiguredPluginsClient from '../configuredPlugins';
import PluginServiceHttpClient from '../client';

describe('ConfiguredPluginsClient', () => {
  const httpClient = new PluginServiceHttpClient('username', 'password');
  const get = jest.spyOn(httpClient, 'get');
  const list = jest.spyOn(httpClient, 'list');
  const client = new ConfiguredPluginsClient(httpClient);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should list configured plugins', async () => {
    // @ts-ignore
    list.mockResolvedValue({ meta: {}, data: {} });

    const result = await client.list('configId');

    expect(result).toEqual({ meta: {}, data: {} });
    expect(list).toHaveBeenCalledTimes(1);
    expect(list).toHaveBeenCalledWith('Configurations/configId/Plugins', 'plugins');
  });

  it('should get configured plugin', async () => {
    get.mockResolvedValue('item');

    const result = await client.get('configId', 'pluginId');

    expect(result).toEqual('item');
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('Configurations/configId/Plugins/pluginId', { cacheable: true });
  });
});
