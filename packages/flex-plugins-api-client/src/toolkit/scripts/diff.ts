import { TwilioError, TwilioApiError } from '@twilio/flex-plugins-utils-exception';

import { ConfigurationsClient, ConfiguredPluginsClient, ReleasesClient } from '../../clients';
import { Script } from '.';
import { internalDescribeConfiguration } from './describeConfiguration';
import { ConfigurationsDiff, findConfigurationsDiff } from '../tools/diff';

export interface DiffOption {
  resource: 'configuration';
  oldIdentifier: string;
  newIdentifier: string;
}

export interface Diff extends ConfigurationsDiff {
  oldSid: string;
  newSid: string;
  activeSid: string | undefined | null;
}

export type DiffScript = Script<DiffOption, Diff>;

/**
 * The .diff script. This script finds the diff between two resources
 * @param configurationClient the Public API  {@link ConfigurationsClient}
 * @param configuredPluginClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function diff(
  configurationClient: ConfigurationsClient,
  configuredPluginClient: ConfiguredPluginsClient,
  releasesClient: ReleasesClient,
): DiffScript {
  const describeConfiguration = internalDescribeConfiguration(configurationClient, configuredPluginClient);

  /**
   * Finds the diff of two configurations
   * @param oldIdentifier the old sid of the configuration
   * @param newIdentifier the new sid of the configuration
   */
  const configurationDiff = async (oldIdentifier: string, newIdentifier: string): Promise<Diff> => {
    const release = await releasesClient.active();

    if (oldIdentifier === 'active' || newIdentifier === 'active') {
      if (!release) {
        throw new TwilioApiError(404, 'No active release exists yet', 404);
      }
      if (oldIdentifier === 'active') {
        oldIdentifier = release.configuration_sid;
      }
      if (newIdentifier === 'active') {
        newIdentifier = release.configuration_sid;
      }
    }

    const oldConfig = await describeConfiguration({ sid: oldIdentifier }, release);
    const newConfig = await describeConfiguration({ sid: newIdentifier }, release);

    return {
      ...findConfigurationsDiff(oldConfig, newConfig),
      oldSid: oldIdentifier,
      newSid: newIdentifier,
      activeSid: release && release.configuration_sid,
    };
  };

  return async (option: DiffOption) => {
    if (option.resource === 'configuration') {
      return configurationDiff(option.oldIdentifier, option.newIdentifier);
    }

    throw new TwilioError(`Diff resource must be 'configuration'`);
  };
}
