import { TwilioError, TwilioApiError } from '@twilio/flex-dev-utils/dist/errors';

import {
  ConfigurationsClient,
  ConfiguredPluginsClient,
  PluginServiceHTTPClient,
  ReleasesClient,
} from '../../../clients';
import * as describeConfigurationScript from '../describeConfiguration';
import diffScript from '../diff';
import * as mockStore from './mockStore';
import * as diffTool from '../../tools/diff';

describe('Diff', () => {
  const oldSid = mockStore.describeConfiguration.sid;
  const newSid = 'FJ0000000000000000000000000000001';
  const diff = { configuration: [], plugins: {}, activeSid: null, oldSid, newSid };
  const httpClient = new PluginServiceHTTPClient('username', 'password');
  const configurationsClient = new ConfigurationsClient(httpClient);
  const configuredPluginsClient = new ConfiguredPluginsClient(httpClient);
  const releasesClient = new ReleasesClient(httpClient);

  const active = jest.spyOn(releasesClient, 'active');
  const describeConfiguration = jest.fn();
  const internalDescribeConfiguration = jest.spyOn(describeConfigurationScript, 'internalDescribeConfiguration');
  const findConfigurationsDiff = jest.spyOn(diffTool, 'findConfigurationsDiff');

  const defaultDescribeConfigurationMock = (
    config1: describeConfigurationScript.DescribeConfiguration,
    config2: describeConfigurationScript.DescribeConfiguration,
  ) => {
    describeConfiguration.mockImplementation((opt) => {
      if (opt.sid === config1.sid) {
        return config1;
      }

      return config2;
    });
  };

  beforeEach(() => {
    jest.resetAllMocks();

    internalDescribeConfiguration.mockImplementation(() => describeConfiguration);
    findConfigurationsDiff.mockReturnValue(diff);
    active.mockResolvedValue(null);
  });

  it('should find diff between two configs', async () => {
    const config1 = { ...mockStore.describeConfiguration };
    const config2 = { ...mockStore.describeConfiguration, sid: newSid };
    const script = diffScript(configurationsClient, configuredPluginsClient, releasesClient);
    defaultDescribeConfigurationMock(config1, config2);

    const theDiff = await script({ resource: 'configuration', oldIdentifier: config1.sid, newIdentifier: config2.sid });

    expect(theDiff).toEqual(diff);
    expect(active).toHaveBeenCalledTimes(1);
    expect(describeConfiguration).toHaveBeenCalledTimes(2);
    expect(describeConfiguration).toHaveBeenCalledWith({ sid: config1.sid }, null);
    expect(describeConfiguration).toHaveBeenCalledWith({ sid: config2.sid }, null);
    expect(findConfigurationsDiff).toHaveBeenCalledTimes(1);
    expect(findConfigurationsDiff).toHaveBeenCalledWith(config1, config2);
  });

  it('should find diff for first config as active', async () => {
    const config1 = { ...mockStore.describeConfiguration };
    const config2 = { ...mockStore.describeConfiguration, sid: newSid };
    const release = { ...mockStore.release, configuration_sid: config1.sid };
    active.mockResolvedValue(release);
    const script = diffScript(configurationsClient, configuredPluginsClient, releasesClient);
    defaultDescribeConfigurationMock(config1, config2);

    const theDiff = await script({ resource: 'configuration', oldIdentifier: 'active', newIdentifier: config2.sid });

    expect(theDiff).toEqual({ ...diff, activeSid: release.configuration_sid });
    expect(active).toHaveBeenCalledTimes(1);
    expect(describeConfiguration).toHaveBeenCalledTimes(2);
    expect(describeConfiguration).toHaveBeenCalledWith({ sid: config1.sid }, release);
    expect(describeConfiguration).toHaveBeenCalledWith({ sid: config2.sid }, release);
    expect(findConfigurationsDiff).toHaveBeenCalledTimes(1);
    expect(findConfigurationsDiff).toHaveBeenCalledWith(config1, config2);
  });

  it('should find diff for second config as active', async () => {
    const config1 = { ...mockStore.describeConfiguration };
    const config2 = { ...mockStore.describeConfiguration, sid: newSid };
    const release = { ...mockStore.release, configuration_sid: config2.sid };
    active.mockResolvedValue(release);
    const script = diffScript(configurationsClient, configuredPluginsClient, releasesClient);
    defaultDescribeConfigurationMock(config1, config2);

    const theDiff = await script({ resource: 'configuration', oldIdentifier: config1.sid, newIdentifier: 'active' });

    expect(theDiff).toEqual({ ...diff, activeSid: release.configuration_sid });
    expect(active).toHaveBeenCalledTimes(1);
    expect(describeConfiguration).toHaveBeenCalledTimes(2);
    expect(describeConfiguration).toHaveBeenCalledWith({ sid: config1.sid }, release);
    expect(describeConfiguration).toHaveBeenCalledWith({ sid: config2.sid }, release);
    expect(findConfigurationsDiff).toHaveBeenCalledTimes(1);
    expect(findConfigurationsDiff).toHaveBeenCalledWith(config1, config2);
  });

  it('should throw exception if no active release found', async (done) => {
    active.mockResolvedValue(null);
    const script = diffScript(configurationsClient, configuredPluginsClient, releasesClient);

    try {
      await script({ resource: 'configuration', oldIdentifier: 'active', newIdentifier: 'active' });
    } catch (e) {
      expect(e).toBeInstanceOf(TwilioApiError);
      expect(e.message).toContain('active release');
      done();
    }
  });

  it('should throw exception if resource is incorrect', async (done) => {
    try {
      const script = diffScript(configurationsClient, configuredPluginsClient, releasesClient);
      // @ts-ignore
      await script({ resource: 'unknown', oldIdentifier: '', newIdentifier: '' });
    } catch (e) {
      expect(e).toBeInstanceOf(TwilioError);
      expect(e.message).toContain('must be');
      done();
    }
  });
});
