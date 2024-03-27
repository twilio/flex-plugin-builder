import {
  ConfigurationsClient,
  ConfiguredPluginsClient,
  PluginServiceHTTPClient,
  ReleasesClient,
} from '../../../clients';
import describeConfigurationScript, { DescribeConfiguration } from '../describeConfiguration';
import { configuration, plugin, version, release, installedPlugin, meta } from './mockStore';

describe('DescribeConfigurationScript', () => {
  const httpClient = new PluginServiceHTTPClient('username', 'password');
  const configurationsClient = new ConfigurationsClient(httpClient);
  const configuredPluginsClient = new ConfiguredPluginsClient(httpClient);
  const releasesClient = new ReleasesClient(httpClient);

  const getConfig = jest.spyOn(configurationsClient, 'get');
  const listInstalledPlugins = jest.spyOn(configuredPluginsClient, 'list');
  const getActiveRelease = jest.spyOn(releasesClient, 'active');

  const script = describeConfigurationScript(configurationsClient, configuredPluginsClient, releasesClient);
  const option = { sid: configuration.sid };

  const expectEndpointsCalled = () => {
    expect(getConfig).toHaveBeenCalledTimes(1);
    expect(getConfig).toHaveBeenCalledWith(option.sid);
    expect(getActiveRelease).toHaveBeenCalledTimes(1);
    expect(listInstalledPlugins).toHaveBeenCalledTimes(1);
    expect(listInstalledPlugins).toHaveBeenCalledWith(option.sid);
  };

  const expectResult = (result: DescribeConfiguration, isActive: boolean, hasPlugins: boolean) => {
    expect(result.sid).toEqual(configuration.sid);
    expect(result.name).toEqual(configuration.name);
    expect(result.description).toEqual(configuration.description);
    expect(result.isActive).toEqual(isActive);
    expect(result.dateCreated).toEqual(configuration.date_created);

    if (hasPlugins) {
      expect(result.plugins).toHaveLength(1);
      expect(result.plugins[0].pluginSid).toEqual(plugin.sid);
      expect(result.plugins[0].pluginVersionSid).toEqual(version.sid);
      expect(result.plugins[0].name).toEqual(plugin.unique_name);
      expect(result.plugins[0].version).toEqual(version.version);
      expect(result.plugins[0].url).toEqual(version.plugin_url);
      expect(result.plugins[0].friendlyName).toEqual(plugin.friendly_name);
      expect(result.plugins[0].description).toEqual(plugin.description);
      expect(result.plugins[0].changelog).toEqual(version.changelog);
      expect(result.plugins[0].isPrivate).toEqual(version.private);
      expect(result.plugins[0].phase).toEqual(3);
    } else {
      expect(result.plugins).toHaveLength(0);
    }
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should use activeRelease from optional', async () => {
    getConfig.mockResolvedValue(configuration);
    listInstalledPlugins.mockResolvedValue({ plugins: [], meta });

    await script({
      ...option,
      resources: { activeRelease: release },
    });

    expect(getActiveRelease).not.toHaveBeenCalled();
  });

  it('should fail if configuration is not found', async () => {
    getConfig.mockRejectedValue('something went wrong');
    try {
      await script(option);
    } catch (e) {
      expect(e).toContain('something went wrong');

      expect(getConfig).toHaveBeenCalledTimes(1);
      expect(getConfig).toHaveBeenCalledWith(option.sid);
      expect(getActiveRelease).toHaveBeenCalledTimes(1);
      expect(listInstalledPlugins).not.toHaveBeenCalled();
    }
  });

  it('should return configuration with no plugins', async () => {
    getConfig.mockResolvedValue(configuration);
    listInstalledPlugins.mockResolvedValue({ plugins: [], meta });

    const result = await script(option);

    expectEndpointsCalled();
    expectResult(result, false, false);
  });

  it('should return configuration with plugins', async () => {
    getConfig.mockResolvedValue(configuration);
    listInstalledPlugins.mockResolvedValue({ plugins: [installedPlugin], meta });

    const result = await script(option);

    expectEndpointsCalled();
    expectResult(result, false, true);
  });

  it('should return active configuration with plugins', async () => {
    getActiveRelease.mockResolvedValue(release);
    getConfig.mockResolvedValue(configuration);
    listInstalledPlugins.mockResolvedValue({ plugins: [installedPlugin], meta });

    const result = await script(option);

    expectEndpointsCalled();
    expectResult(result, true, true);
  });
});
