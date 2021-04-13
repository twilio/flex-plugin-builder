import {
  ConfiguredPluginsClient,
  PluginsClient,
  PluginServiceHTTPClient,
  PluginVersionsClient,
  ReleasesClient,
} from 'flex-plugins-api-client';

import describePluginScript, { DescribePlugin } from '../describePlugin';
import { plugin, version, release, installedPlugin, meta } from './mockStore';

describe('DescribePlugin', () => {
  const httpClient = new PluginServiceHTTPClient('username', 'password');
  const pluginsClient = new PluginsClient(httpClient);
  const versionsClient = new PluginVersionsClient(httpClient);
  const configuredPluginsClient = new ConfiguredPluginsClient(httpClient);
  const releasesClient = new ReleasesClient(httpClient);

  const getPlugin = jest.spyOn(pluginsClient, 'get');
  const listVersions = jest.spyOn(versionsClient, 'list');
  const getActiveRelease = jest.spyOn(releasesClient, 'active');
  const listInstalledPlugins = jest.spyOn(configuredPluginsClient, 'list');

  const script = describePluginScript(pluginsClient, versionsClient, configuredPluginsClient, releasesClient);
  const option = { name: plugin.unique_name };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  const expectEndpointsCalled = () => {
    expect(getPlugin).toHaveBeenCalledTimes(1);
    expect(getPlugin).toHaveBeenCalledWith(option.name);
    expect(listVersions).toHaveBeenCalledTimes(1);
    expect(listVersions).toHaveBeenCalledWith(option.name);
    expect(getActiveRelease).toHaveBeenCalledTimes(1);
  };

  const expectResult = (result: DescribePlugin, withVersion: boolean, isActive = false) => {
    expect(result.sid).toEqual(plugin.sid);
    expect(result.name).toEqual(plugin.unique_name);
    expect(result.friendlyName).toEqual(plugin.friendly_name);
    expect(result.description).toEqual(plugin.description);
    expect(result.isActive).toEqual(isActive);
    expect(result.dateCreated).toEqual(plugin.date_created);
    expect(result.dateUpdated).toEqual(plugin.date_updated);

    if (withVersion) {
      expect(result.versions).toHaveLength(1);
      expect(result.versions[0].sid).toEqual(version.sid);
      expect(result.versions[0].version).toEqual(version.version);
      expect(result.versions[0].url).toEqual(version.plugin_url);
      expect(result.versions[0].changelog).toEqual(version.changelog);
      expect(result.versions[0].isPrivate).toEqual(version.private);
      expect(result.versions[0].isActive).toEqual(isActive);
      expect(result.versions[0].dateCreated).toEqual(version.date_created);
    } else {
      expect(result.versions).toHaveLength(0);
    }
  };

  const setupActiveRelease = () => {
    getPlugin.mockResolvedValue(plugin);
    listVersions.mockResolvedValue({ plugin_versions: [version], meta });
    getActiveRelease.mockResolvedValue(release);
    listInstalledPlugins.mockResolvedValue({ plugins: [], meta });
  };

  it('should use plugin from optional', async () => {
    listVersions.mockResolvedValue({ plugin_versions: [], meta });

    await script({
      ...option,
      resources: { plugin },
    });

    expect(getPlugin).not.toHaveBeenCalled();
  });

  it('should use activeRelease from optional', async () => {
    setupActiveRelease();
    await script({
      ...option,
      resources: {
        activeRelease: release,
      },
    });

    expect(getActiveRelease).not.toHaveBeenCalled();
  });

  it('should use configuredPlugins from optional', async () => {
    setupActiveRelease();
    await script({
      ...option,
      resources: {
        configuredPlugins: { plugins: [], meta },
      },
    });

    expect(listInstalledPlugins).not.toHaveBeenCalled();
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

  it('should return plugin with no versions', async () => {
    getPlugin.mockResolvedValue(plugin);
    listVersions.mockResolvedValue({ plugin_versions: [], meta });

    const result = await script(option);

    expectEndpointsCalled();
    expectResult(result, false);
    expect(listInstalledPlugins).not.toHaveBeenCalled();
  });

  it('should return plugin with versions', async () => {
    getPlugin.mockResolvedValue(plugin);
    listVersions.mockResolvedValue({ plugin_versions: [version], meta });

    const result = await script(option);

    expectEndpointsCalled();
    expectResult(result, true);
    expect(listInstalledPlugins).not.toHaveBeenCalled();
  });

  it('should have active release, but no active plugin/version', async () => {
    setupActiveRelease();
    listInstalledPlugins.mockResolvedValue({ plugins: [], meta });

    const result = await script(option);

    expectEndpointsCalled();
    expectResult(result, true);
    expect(listInstalledPlugins).toHaveBeenCalledTimes(1);
    expect(listInstalledPlugins).toHaveBeenCalledTimes(1);
    expect(listInstalledPlugins).toHaveBeenCalledWith(release.configuration_sid);
  });

  it('should have active release and active plugin/version', async () => {
    setupActiveRelease();
    listInstalledPlugins.mockResolvedValue({ plugins: [installedPlugin], meta });

    const result = await script(option);

    expectEndpointsCalled();
    expectResult(result, true, true);
    expect(listInstalledPlugins).toHaveBeenCalledTimes(1);
    expect(listInstalledPlugins).toHaveBeenCalledTimes(1);
    expect(listInstalledPlugins).toHaveBeenCalledWith(release.configuration_sid);
  });
});
