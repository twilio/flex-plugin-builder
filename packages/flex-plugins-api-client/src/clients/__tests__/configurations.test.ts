import ConfigurationsClient from '../configurations';
import PluginServiceHttpClient from '../client';

describe('ConfigurationsClient', () => {
  const httpClient = new PluginServiceHttpClient('username', 'password');
  const list = jest.spyOn(httpClient, 'list');
  const get = jest.spyOn(httpClient, 'get');
  const post = jest.spyOn(httpClient, 'post');
  const client = new ConfigurationsClient(httpClient);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should list configurations without pagination', async () => {
    // @ts-ignore
    list.mockResolvedValue('list');

    const result = await client.list();

    expect(result).toEqual('list');
    expect(list).toHaveBeenCalledTimes(1);
    expect(list).toHaveBeenCalledWith('Configurations', 'configurations', undefined);
  });

  it('should list configurations with pagination', async () => {
    // @ts-ignore
    list.mockResolvedValue('list');

    const result = await client.list({ page: 1 });

    expect(result).toEqual('list');
    expect(list).toHaveBeenCalledTimes(1);
    expect(list).toHaveBeenCalledWith('Configurations', 'configurations', { page: 1 });
  });

  it('should get configurations', async () => {
    get.mockResolvedValue('item');

    const result = await client.get('configId');

    expect(result).toEqual('item');
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('Configurations/configId', { cacheable: true });
  });

  it('should create configurations', async () => {
    post.mockResolvedValue('created');

    const payload = { Name: 'the name', Plugins: [] };
    const result = await client.create(payload);

    expect(result).toEqual('created');
    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith('Configurations', payload);
  });

  it('should get the latest version', async () => {
    // @ts-ignore
    list.mockResolvedValue({ configurations: ['config1', 'config2'] });

    const result = await client.latest();

    expect(result).toEqual('config1');
    expect(list).toHaveBeenCalledTimes(1);
    expect(list).toHaveBeenCalledWith('Configurations', 'configurations', undefined);
  });

  it('should archive configuration', async () => {
    post.mockResolvedValue('item');

    const result = await client.archive('configId');

    expect(result).toEqual('item');
    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith('Configurations/configId/Archive', {});
  });
});
