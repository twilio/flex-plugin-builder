import { PluginsClient } from 'flex-plugins-api-client';

import { Script, Plugin } from '.';

export interface ArchivePluginOption {
  name: string;
}

export type ArchivePluginScript = Script<ArchivePluginOption, Plugin>;

/**
 * The .archivePlugin script. This script archives a plugin
 * @param pluginsClient        the Public API {@link PluginsClient}
 */
export default function archivePlugin(pluginsClient: PluginsClient): ArchivePluginScript {
  return async (options: ArchivePluginOption) => {
    const plugin = await pluginsClient.archive(options.name);

    return {
      sid: plugin.sid,
      name: plugin.unique_name,
      friendlyName: plugin.friendly_name,
      description: plugin.description,
      isArchived: plugin.archived,
      dateCreated: plugin.date_created,
      dateUpdated: plugin.date_updated,
    };
  };
}
