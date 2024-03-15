import PluginVersionsClient from '../pluginVersions';
import PluginServiceHttpClient from '../client';

describe('PluginVersionsClient', () => {
  const httpClient = new PluginServiceHttpClient('username', 'password');
  const list = jest.spyOn(httpClient, 'list');
  const get = jest.spyOn(httpClient, 'get');
  const post = jest.spyOn(httpClient, 'post');

  const versionsInstanceUri = 'Plugins/pluginId/Versions';

  const client = new PluginVersionsClient(httpClient);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should list plugin versions without pagination', async () => {
    // @ts-ignore
    list.mockResolvedValue('list');

    const result = await client.list('pluginId');

    expect(result).toEqual('list');
    expect(list).toHaveBeenCalledTimes(1);
    expect(list).toHaveBeenCalledWith(versionsInstanceUri, 'plugin_versions', undefined);
  });

  it('should list plugin versions with pagination', async () => {
    // @ts-ignore
    list.mockResolvedValue('list');

    const result = await client.list('pluginId', { page: 1 });

    expect(result).toEqual('list');
    expect(list).toHaveBeenCalledTimes(1);
    expect(list).toHaveBeenCalledWith(versionsInstanceUri, 'plugin_versions', { page: 1 });
  });

  it('should get the latest version', async () => {
    // @ts-ignore
    list.mockResolvedValue({ plugin_versions: ['version1', 'version2'] });

    const result = await client.latest('pluginId');

    expect(result).toEqual('version1');
    expect(list).toHaveBeenCalledTimes(1);
    expect(list).toHaveBeenCalledWith(versionsInstanceUri, 'plugin_versions', undefined);
  });

  it('should get plugin versions', async () => {
    get.mockResolvedValue('item');

    const result = await client.get('pluginId', 'versionId');

    expect(result).toEqual('item');
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('Plugins/pluginId/Versions/versionId', { cacheable: true });
  });

  it('should create plugin version', async () => {
    post.mockResolvedValue('created');

    const payload = { Version: '1.2.3', PluginUrl: 'https://twilio.com' };
    const result = await client.create('pluginId', payload);

    expect(result).toEqual('created');
    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith(versionsInstanceUri, payload);
  });

  it('should archive plugin version', async () => {
    post.mockResolvedValue('item');

    const result = await client.archive('pluginId', 'versionId');

    expect(result).toEqual('item');
    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith('Plugins/pluginId/Versions/versionId/Archive', {});
  });
});
