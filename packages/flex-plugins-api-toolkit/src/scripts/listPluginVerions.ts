import {
  ConfiguredPluginResourcePage,
  ConfiguredPluginsClient,
  PluginVersionsClient,
  ReleaseResource,
  ReleasesClient,
} from 'flex-plugins-api-client';

import { ListResource, Page, ResourceNames, Script } from '.';

interface OptionalResources {
  configuredPlugins?: ConfiguredPluginResourcePage;
  activeRelease?: ReleaseResource;
}

export interface ListPluginVersionsOption extends Page {
  name: string;
  resources?: OptionalResources;
}

export interface ListPluginVersions {
  sid: string;
  pluginSid: string;
  version: string;
  url: string;
  changelog: string;
  isPrivate: boolean;
  isActive: boolean;
  dateCreated: string;
}

export type ListPluginVersionsResource = ListResource<ResourceNames.PluginVersions, ListPluginVersions>;
export type ListPluginVersionsScripts = Script<ListPluginVersionsOption, ListPluginVersionsResource>;

/**
 * The .listPluginVersions script. This script returns overall information about a PluginVersion
 * @param pluginVersionsClient        the Public API {@link PluginVersionsClient}
 * @param configuredPluginsClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function listPluginVersions(
  pluginVersionsClient: PluginVersionsClient,
  configuredPluginsClient: ConfiguredPluginsClient,
  releasesClient: ReleasesClient,
): ListPluginVersionsScripts {
  return async (option) => {
    const resources = option.resources ? option.resources : ({} as OptionalResources);

    const [result, release] = await Promise.all([
      pluginVersionsClient.list(option.name, option.page),
      resources.activeRelease ? Promise.resolve(resources.activeRelease) : releasesClient.active(),
    ]);

    const versions = result.plugin_versions.map((version) => ({
      sid: version.sid,
      pluginSid: version.plugin_sid,
      version: version.version,
      url: version.plugin_url,
      changelog: version.changelog,
      isPrivate: version.private,
      isActive: false,
      dateCreated: version.date_created,
    }));

    if (release && versions.length) {
      const list = await (resources.configuredPlugins
        ? Promise.resolve(resources.configuredPlugins)
        : configuredPluginsClient.list(release.configuration_sid));

      versions.forEach(
        (version) => (version.isActive = list.plugins.some((p) => p.plugin_version_sid === version.sid)),
      );
    }

    return {
      plugin_versions: versions,
      meta: result.meta,
    };
  };
}
