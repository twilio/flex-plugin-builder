import {
  PluginServiceHTTPClient,
  ConfigurationsClient,
  ConfiguredPluginsClient,
  ReleasesClient,
} from 'flex-plugins-api-client';

import describeReleaseScript from '../describeRelease';
import { describeConfiguration as configuration, release } from './mockStore';
import * as describeConfigurationScript from '../describeConfiguration';

describe('describeRelease', () => {
  const httpClient = new PluginServiceHTTPClient('username', 'password');
  const configurationsClient = new ConfigurationsClient(httpClient);
  const configuredPluginsClient = new ConfiguredPluginsClient(httpClient);
  const releaseClient = new ReleasesClient(httpClient);

  const get = jest.spyOn(releaseClient, 'get');
  const active = jest.spyOn(releaseClient, 'active');
  const describeConfiguration = jest.fn();
  const internal = jest.spyOn(describeConfigurationScript, 'internalDescribeConfiguration');

  const script = describeReleaseScript(configurationsClient, configuredPluginsClient, releaseClient);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should use activeRelease from optional', async () => {
    internal.mockImplementation(() => describeConfiguration);
    get.mockResolvedValue(release);

    await script({
      sid: release.sid,
      resources: { activeRelease: release },
    });

    expect(active).not.toHaveBeenCalled();
  });

  it('should return non-active release', async () => {
    active.mockResolvedValue(null);
    describeConfiguration.mockResolvedValue(configuration);
    internal.mockImplementation(() => describeConfiguration);
    get.mockResolvedValue(release);

    const result = await script({
      sid: release.sid,
    });

    expect(result.sid).toEqual(release.sid);
    expect(result.configurationSid).toEqual(release.configuration_sid);
    expect(result.isActive).toEqual(false);
    expect(result.configuration.sid).toEqual(configuration.sid);
    expect(result.configuration.description).toEqual(configuration.description);
    expect(result.configuration.name).toEqual(configuration.name);
    expect(result.configuration.isActive).toEqual(configuration.isActive);
    expect(result.configuration.dateCreated).toEqual(configuration.dateCreated);
    expect(result.dateCreated).toEqual(release.date_created);

    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith(release.sid);
    expect(internal).toHaveBeenCalledTimes(1);
    expect(internal).toHaveBeenCalledWith(configurationsClient, configuredPluginsClient);
    expect(describeConfiguration).toHaveBeenCalledTimes(1);
    expect(describeConfiguration).toHaveBeenCalledWith({ sid: release.configuration_sid }, release);
    expect(active).toHaveBeenCalledTimes(1);
  });
});
