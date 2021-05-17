import { PluginServiceHTTPClient, ConfigurationsClient, ReleasesClient } from 'flex-plugins-api-client';

import listConfigurationsScript, { ListConfigurationsResource } from '../listConfigurations';
import { configuration, meta, release } from './mockStore';

describe('ListConfigurationsScript', () => {
  const httpClient = new PluginServiceHTTPClient('username', 'password');
  const configurationsClient = new ConfigurationsClient(httpClient);
  const releaseClient = new ReleasesClient(httpClient);

  const list = jest.spyOn(configurationsClient, 'list');
  const active = jest.spyOn(releaseClient, 'active');

  const script = listConfigurationsScript(configurationsClient, releaseClient);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const assertConfiguration = (result: ListConfigurationsResource, isActive: boolean) => {
    expect(result.configurations).toHaveLength(1);
    expect(result.configurations[0]).toEqual({
      sid: configuration.sid,
      name: configuration.name,
      description: configuration.description,
      isActive,
      dateCreated: configuration.date_created,
    });
    expect(result.meta).toEqual(meta);
  };

  it('should use activeRelease from optional', async () => {
    list.mockResolvedValue({ configurations: [configuration], meta });
    await script({
      resources: { activeRelease: release },
    });

    expect(active).not.toHaveBeenCalled();
  });

  it('should list configurations with no release and pagination', async () => {
    list.mockResolvedValue({ configurations: [configuration], meta });
    active.mockResolvedValue(null);

    const result = await script({});

    expect(list).toHaveBeenCalledTimes(1);
    expect(list).toHaveBeenCalledWith(undefined);
    expect(active).toHaveBeenCalledTimes(1);
    assertConfiguration(result, false);
  });

  it('should list configurations with no release and with pagination', async () => {
    list.mockResolvedValue({ configurations: [configuration], meta });
    active.mockResolvedValue(null);

    const result = await script({ page: { pageSize: 1 } });

    expect(list).toHaveBeenCalledTimes(1);
    expect(list).toHaveBeenCalledWith({ pageSize: 1 });
    expect(active).toHaveBeenCalledTimes(1);
    assertConfiguration(result, false);
  });

  it('should list configurations with release but none are active', async () => {
    const _release = { ...release };
    _release.configuration_sid = 'FJ000';

    list.mockResolvedValue({ configurations: [configuration], meta });
    active.mockResolvedValue(_release);

    const result = await script({});

    expect(list).toHaveBeenCalledTimes(1);
    expect(list).toHaveBeenCalledWith(undefined);
    expect(active).toHaveBeenCalledTimes(1);
    assertConfiguration(result, false);
  });

  it('should list configurations with release and is active', async () => {
    const _release = { ...release };
    _release.configuration_sid = configuration.sid;

    list.mockResolvedValue({ configurations: [configuration], meta });
    active.mockResolvedValue(_release);

    const result = await script({});

    expect(list).toHaveBeenCalledTimes(1);
    expect(list).toHaveBeenCalledWith(undefined);
    expect(active).toHaveBeenCalledTimes(1);
    assertConfiguration(result, true);
  });
});
