import {
  ConfigurationsClient,
  ConfiguredPluginsClient,
  ReleaseResource,
  ReleasesClient,
} from 'flex-plugins-api-client';

import { Script } from '.';
import { DeployPlugin } from './deploy';

interface OptionalResources {
  activeRelease?: ReleaseResource;
}

export interface DescribeConfigurationOption {
  sid: string;
  resources?: OptionalResources;
}

export interface ConfiguredPlugins extends DeployPlugin {
  phase: number;
}

export interface Configuration {
  sid: string;
  name: string;
  description: string;
  isArchived: boolean;
  dateCreated: string;
}

export interface DescribeConfiguration extends Configuration {
  isActive: boolean;
  plugins: ConfiguredPlugins[];
}

export type DescribeConfigurationScript = Script<DescribeConfigurationOption, DescribeConfiguration>;

/**
 * Internal method for returning configuration
 * @param configurationClient the Public API  {@link ConfigurationsClient}
 * @param configuredPluginClient the Public API {@link ConfiguredPluginsClient}
 */
export function internalDescribeConfiguration(
  configurationClient: ConfigurationsClient,
  configuredPluginClient: ConfiguredPluginsClient,
) {
  return async (
    option: DescribeConfigurationOption,
    release: ReleaseResource | null,
  ): Promise<DescribeConfiguration> => {
    const configuration = await configurationClient.get(option.sid);

    const isActive = Boolean(release && release.configuration_sid === configuration.sid);
    const list = (await configuredPluginClient.list(option.sid)).plugins;

    const installedPlugins: ConfiguredPlugins[] = list.map((p) => {
      return {
        pluginSid: p.plugin_sid,
        pluginVersionSid: p.plugin_version_sid,
        name: p.unique_name,
        version: p.version,
        url: p.plugin_url,
        friendlyName: p.friendly_name,
        description: p.description,
        changelog: p.changelog,
        isPrivate: p.private,
        isArchived: p.plugin_archived,
        phase: p.phase,
      };
    });

    return {
      sid: configuration.sid,
      name: configuration.name,
      description: configuration.description,
      isActive,
      isArchived: configuration.archived,
      plugins: installedPlugins,
      dateCreated: configuration.date_created,
    };
  };
}

/**
 * The .describeConfiguration script. This script describes a configuration.
 * @param configurationClient the Public API  {@link ConfigurationsClient}
 * @param configuredPluginClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function describeConfiguration(
  configurationClient: ConfigurationsClient,
  configuredPluginClient: ConfiguredPluginsClient,
  releasesClient: ReleasesClient,
): DescribeConfigurationScript {
  return async (option: DescribeConfigurationOption) => {
    const resources = option.resources ? option.resources : ({} as OptionalResources);
    const release = await (resources.activeRelease
      ? Promise.resolve(resources.activeRelease)
      : releasesClient.active());

    return internalDescribeConfiguration(configurationClient, configuredPluginClient)(option, release);
  };
}
