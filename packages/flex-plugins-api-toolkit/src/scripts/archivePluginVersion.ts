import { PluginVersionsClient } from 'flex-plugins-api-client';

import { Script, PluginVersion } from '.';

export interface ArchivePluginVersionOption {
  name: string;
  version: string;
}

export type ArchivePluginVersionScript = Script<ArchivePluginVersionOption, PluginVersion>;

/**
 * The .archivePluginVersion script. This script archives a plugin version
 * @param pluginVersionsClient        the Public API {@link PluginVersionsClient}
 */
export default function archivePluginVersion(pluginVersionsClient: PluginVersionsClient): ArchivePluginVersionScript {
  return async (options: ArchivePluginVersionOption) => {
    const pluginVersion = await pluginVersionsClient.archive(options.name, options.version);

    return {
      sid: pluginVersion.sid,
      version: pluginVersion.version,
      url: pluginVersion.plugin_url,
      changelog: pluginVersion.changelog,
      isPrivate: pluginVersion.private,
      isArchived: pluginVersion.archived,
      dateCreated: pluginVersion.date_created,
    };
  };
}
