import {
  PluginServiceHTTPClient,
  ConfiguredPluginsClient,
  PluginVersionsClient,
  ReleasesClient,
} from 'flex-plugins-api-client';

import listPluginVersionsScript, { ListPluginVersionsResource } from '../listPluginVerions';
import { installedPlugin, meta, version, release } from './mockStore';

describe('ListPluginsScript', () => {
  const httpClient = new PluginServiceHTTPClient('username', 'password');
  const pluginVersionsClient = new PluginVersionsClient(httpClient);
  const configuredPluginsClient = new ConfiguredPluginsClient(httpClient);
  const releaseClient = new ReleasesClient(httpClient);

  const listVersions = jest.spyOn(pluginVersionsClient, 'list');
  const listConfiguredPlugins = jest.spyOn(configuredPluginsClient, 'list');
  const active = jest.spyOn(releaseClient, 'active');

  const script = listPluginVersionsScript(pluginVersionsClient, configuredPluginsClient, releaseClient);
  const option = { name: 'plugin-sample' };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const assertVersions = (result: ListPluginVersionsResource, isActive: boolean) => {
    expect(result.plugin_versions).toHaveLength(1);
    expect(result.plugin_versions[0]).toEqual({
      sid: version.sid,
      pluginSid: version.plugin_sid,
      version: version.version,
      url: version.plugin_url,
      changelog: version.changelog,
      isPrivate: version.private,
      isActive,
      dateCreated: version.date_created,
    });
    expect(result.meta).toEqual(meta);
  };

  it('should use activeRelease from optional', async () => {
    listVersions.mockResolvedValue({ plugin_versions: [version], meta });
    listConfiguredPlugins.mockResolvedValue({ plugins: [installedPlugin], meta });

    await script({
      ...option,
      resources: { activeRelease: release },
    });

    expect(active).not.toHaveBeenCalled();
  });

  it('should use configuredPlugin from optional', async () => {
    listVersions.mockResolvedValue({ plugin_versions: [version], meta });
    active.mockResolvedValue(release);

    await script({
      ...option,
      resources: { configuredPlugins: { plugins: [installedPlugin], meta } },
    });

    expect(listConfiguredPlugins).not.toHaveBeenCalled();
  });

  it('should list versions with no release and pagination', async () => {
    listVersions.mockResolvedValue({ plugin_versions: [version], meta });
    active.mockResolvedValue(null);

    const result = await script(option);

    expect(listVersions).toHaveBeenCalledTimes(1);
    expect(listVersions).toHaveBeenCalledWith(option.name, undefined);
    expect(active).toHaveBeenCalledTimes(1);
    expect(listConfiguredPlugins).not.toHaveBeenCalled();
    assertVersions(result, false);
  });

  it('should list versions with no release and with pagination', async () => {
    listVersions.mockResolvedValue({ plugin_versions: [version], meta });
    active.mockResolvedValue(null);

    const result = await script({ ...option, page: { pageSize: 1 } });

    expect(listVersions).toHaveBeenCalledTimes(1);
    expect(listVersions).toHaveBeenCalledWith(option.name, { pageSize: 1 });
    expect(active).toHaveBeenCalledTimes(1);
    expect(listConfiguredPlugins).not.toHaveBeenCalled();
    assertVersions(result, false);
  });

  it('should list versions with release but none are active', async () => {
    const _installedPlugins = { ...installedPlugin };
    _installedPlugins.plugin_version_sid = 'FV000';

    listVersions.mockResolvedValue({ plugin_versions: [version], meta });
    listConfiguredPlugins.mockResolvedValue({ plugins: [_installedPlugins], meta });
    active.mockResolvedValue(release);

    const result = await script(option);

    expect(listVersions).toHaveBeenCalledTimes(1);
    expect(listVersions).toHaveBeenCalledWith(option.name, undefined);
    expect(active).toHaveBeenCalledTimes(1);
    expect(listConfiguredPlugins).toHaveBeenCalledTimes(1);
    expect(listConfiguredPlugins).toHaveBeenCalledWith(release.configuration_sid);
    assertVersions(result, false);
  });

  it('should list versions with release and is active', async () => {
    const _installedPlugins = { ...installedPlugin };
    _installedPlugins.plugin_version_sid = version.sid;

    listVersions.mockResolvedValue({ plugin_versions: [version], meta });
    listConfiguredPlugins.mockResolvedValue({ plugins: [_installedPlugins], meta });
    active.mockResolvedValue(release);

    const result = await script(option);

    expect(listVersions).toHaveBeenCalledTimes(1);
    expect(listVersions).toHaveBeenCalledWith(option.name, undefined);
    expect(active).toHaveBeenCalledTimes(1);
    expect(listConfiguredPlugins).toHaveBeenCalledTimes(1);
    expect(listConfiguredPlugins).toHaveBeenCalledWith(release.configuration_sid);
    assertVersions(result, true);
  });
});
