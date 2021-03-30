import {
  ConfiguredPluginResourcePage,
  ConfiguredPluginResource,
  ConfiguredPluginsClient,
  PluginResource,
  PluginsClient,
  PluginVersionResource,
  PluginVersionsClient,
  ReleaseResource,
  ReleasesClient,
} from 'flex-plugins-api-client';

import { Script } from '.';
import { DescribePluginVersion } from './describePluginVersion';

interface OptionalResources {
  plugin?: PluginResource;
  activeRelease?: ReleaseResource;
  configuredPlugins?: ConfiguredPluginResourcePage;
}

export interface DescribePluginOption {
  name: string;
  resources?: OptionalResources;
}

type PluginVersion = Omit<DescribePluginVersion, 'plugin'>;

export interface Plugin {
  sid: string;
  name: string;
  friendlyName: string;
  description: string;
  isArchived: boolean;
  dateCreated: string;
  dateUpdated: string;
}

export interface DescribePlugin extends Plugin {
  isActive: boolean;
  versions: PluginVersion[];
}

export type DescribePluginScript = Script<DescribePluginOption, DescribePlugin>;

/**
 * The .describePlugin script. This script describes a plugin
 * @param pluginClient        the Public API {@link PluginsClient}
 * @param pluginVersionClient the Public API {@link PluginVersionsClient}
 * @param configuredPluginsClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function describePlugin(
  pluginClient: PluginsClient,
  pluginVersionClient: PluginVersionsClient,
  configuredPluginsClient: ConfiguredPluginsClient,
  releasesClient: ReleasesClient,
): DescribePluginScript {
  return async (option: DescribePluginOption) => {
    const resources = option.resources ? option.resources : ({} as OptionalResources);

    const [plugin, versions, release] = await Promise.all([
      resources.plugin ? Promise.resolve(resources.plugin) : pluginClient.get(option.name),
      pluginVersionClient.list(option.name),
      resources.activeRelease ? Promise.resolve(resources.activeRelease) : releasesClient.active(),
    ]);

    let isPluginActive = false;
    const formattedVersions: PluginVersion[] = versions.plugin_versions.map((version: PluginVersionResource) => ({
      sid: version.sid,
      version: version.version,
      url: version.plugin_url,
      changelog: version.changelog,
      isPrivate: version.private,
      isActive: false,
      isArchived: version.archived,
      dateCreated: version.date_created,
    }));

    if (release) {
      const list = await (resources.configuredPlugins
        ? Promise.resolve(resources.configuredPlugins)
        : configuredPluginsClient.list(release.configuration_sid));
      isPluginActive = list.plugins.some((p: ConfiguredPluginResource) => p.plugin_sid === plugin.sid);
      formattedVersions.forEach((v) => {
        v.isActive = list.plugins.some((p: ConfiguredPluginResource) => p.plugin_version_sid === v.sid);
      });
    }

    return {
      sid: plugin.sid,
      name: plugin.unique_name,
      friendlyName: plugin.friendly_name,
      description: plugin.description,
      isActive: isPluginActive,
      isArchived: plugin.archived,
      versions: formattedVersions,
      dateCreated: plugin.date_created,
      dateUpdated: plugin.date_updated,
    };
  };
}
