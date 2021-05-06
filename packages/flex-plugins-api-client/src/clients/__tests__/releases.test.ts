import ReleasesClient from '../releases';
import PluginServiceHttpClient from '../client';

describe('ReleasesClient', () => {
  const httpClient = new PluginServiceHttpClient('username', 'password');
  const list = jest.spyOn(httpClient, 'list');
  const get = jest.spyOn(httpClient, 'get');
  const post = jest.spyOn(httpClient, 'post');
  const client = new ReleasesClient(httpClient);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should list releases without pagination', async () => {
    // @ts-ignore
    list.mockResolvedValue('list');

    const result = await client.list();

    expect(result).toEqual('list');
    expect(list).toHaveBeenCalledTimes(1);
    expect(list).toHaveBeenCalledWith('Releases', 'releases', undefined);
  });

  it('should list releases with pagination', async () => {
    // @ts-ignore
    list.mockResolvedValue('list');

    const result = await client.list({ page: 1 });

    expect(result).toEqual('list');
    expect(list).toHaveBeenCalledTimes(1);
    expect(list).toHaveBeenCalledWith('Releases', 'releases', { page: 1 });
  });

  it('should get the active release', async () => {
    // @ts-ignore
    list.mockResolvedValue({ releases: ['release1', 'release2'] });

    const result = await client.active();

    expect(result).toEqual('release1');
    expect(list).toHaveBeenCalledTimes(1);
    expect(list).toHaveBeenCalledWith('Releases', 'releases', undefined);
  });

  it('should get a release', async () => {
    get.mockResolvedValue('item');

    const result = await client.get('releaseId');

    expect(result).toEqual('item');
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('Releases/releaseId', { cacheable: true });
  });

  it('should create a release', async () => {
    post.mockResolvedValue('created');

    const payload = { ConfigurationId: '1.0.0' };
    const result = await client.create(payload);

    expect(result).toEqual('created');
    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith('Releases', payload);
  });
});
