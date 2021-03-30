import {
  ConfiguredPluginsClient,
  PluginsClient,
  PluginServiceHTTPClient,
  PluginVersionsClient,
  ReleasesClient,
} from 'flex-plugins-api-client';

import describePluginVersionScript, { DescribePluginVersion } from '../describePluginVersion';
import { plugin, version, release, installedPlugin, meta } from './mockStore';

describe('DescribePluginVersion', () => {
  const httpClient = new PluginServiceHTTPClient('username', 'password');
  const pluginsClient = new PluginsClient(httpClient);
  const versionsClient = new PluginVersionsClient(httpClient);
  const configuredPluginsClient = new ConfiguredPluginsClient(httpClient);
  const releasesClient = new ReleasesClient(httpClient);

  const getPlugin = jest.spyOn(pluginsClient, 'get');
  const getVersion = jest.spyOn(versionsClient, 'get');
  const getActiveRelease = jest.spyOn(releasesClient, 'active');
  const listInstalledPlugins = jest.spyOn(configuredPluginsClient, 'list');

  const script = describePluginVersionScript(pluginsClient, versionsClient, configuredPluginsClient, releasesClient);
  const option = { name: plugin.unique_name, version: version.version };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const expectEndpointsCalled = () => {
    expect(getPlugin).toHaveBeenCalledTimes(1);
    expect(getPlugin).toHaveBeenCalledWith(option.name);
    expect(getVersion).toHaveBeenCalledTimes(1);
    expect(getVersion).toHaveBeenCalledWith(option.name, option.version);
    expect(getActiveRelease).toHaveBeenCalledTimes(1);
  };

  const expectResult = (result: DescribePluginVersion, isActive: boolean) => {
    expect(result.sid).toEqual(version.sid);
    expect(result.version).toEqual(version.version);
    expect(result.url).toEqual(version.plugin_url);
    expect(result.changelog).toEqual(version.changelog);
    expect(result.isPrivate).toEqual(version.private);
    expect(result.isActive).toEqual(isActive);
    expect(result.plugin.sid).toEqual(plugin.sid);
    expect(result.plugin.name).toEqual(plugin.unique_name);
    expect(result.plugin.friendlyName).toEqual(plugin.friendly_name);
    expect(result.plugin.description).toEqual(plugin.description);
    expect(result.plugin.dateCreated).toEqual(plugin.date_created);
    expect(result.plugin.dateUpdated).toEqual(plugin.date_updated);
  };

  it('should get plugin from optional', async () => {
    getVersion.mockResolvedValue(version);

    await script({
      ...option,
      resources: { plugin },
    });

    expect(getPlugin).not.toHaveBeenCalled();
  });

  it('should get activeReelase from optional', async () => {
    getPlugin.mockResolvedValue(plugin);
    getVersion.mockResolvedValue(version);
    listInstalledPlugins.mockResolvedValue({ plugins: [], meta });

    await script({
      ...option,
      resources: { activeRelease: release },
    });

    expect(getActiveRelease).not.toHaveBeenCalled();
  });

  it('should throw an error if plugin is not found', async (done) => {
    getPlugin.mockRejectedValue('something went wrong');

    try {
      await script(option);
    } catch (e) {
      expect(e).toContain('something went wrong');
      expectEndpointsCalled();

      done();
    }
  });

  it('should return version', async () => {
    getPlugin.mockResolvedValue(plugin);
    getVersion.mockResolvedValue(version);

    const result = await script(option);

    expectEndpointsCalled();
    expectResult(result, false);
    expect(listInstalledPlugins).not.toHaveBeenCalled();
  });

  it('should have active release, but no active/version', async () => {
    getPlugin.mockResolvedValue(plugin);
    getVersion.mockResolvedValue(version);
    getActiveRelease.mockResolvedValue(release);
    listInstalledPlugins.mockResolvedValue({ plugins: [], meta });

    const result = await script(option);

    expectEndpointsCalled();
    expectResult(result, false);
    expect(listInstalledPlugins).toHaveBeenCalledTimes(1);
    expect(listInstalledPlugins).toHaveBeenCalledTimes(1);
    expect(listInstalledPlugins).toHaveBeenCalledWith(release.configuration_sid);
  });

  it('should have active release and active version', async () => {
    getPlugin.mockResolvedValue(plugin);
    getVersion.mockResolvedValue(version);
    getActiveRelease.mockResolvedValue(release);
    listInstalledPlugins.mockResolvedValue({ plugins: [installedPlugin], meta });

    const result = await script(option);

    expectEndpointsCalled();
    expectResult(result, true);
    expect(listInstalledPlugins).toHaveBeenCalledTimes(1);
    expect(listInstalledPlugins).toHaveBeenCalledTimes(1);
    expect(listInstalledPlugins).toHaveBeenCalledWith(release.configuration_sid);
  });
});
