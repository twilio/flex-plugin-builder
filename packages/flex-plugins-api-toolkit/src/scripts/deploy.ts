import {
  CreatePluginResource,
  CreatePluginVersionResource,
  PluginsClient,
  PluginVersionsClient,
} from 'flex-plugins-api-client';

import { Script } from '.';

export interface DeployOption {
  name: string;
  url: string;
  version: string;
  friendlyName?: string;
  description?: string;
  changelog?: string;
  isPrivate?: boolean;
}

export interface DeployPlugin {
  pluginSid: string;
  pluginVersionSid: string;
  name: string;
  version: string;
  url: string;
  friendlyName: string;
  description: string;
  changelog: string;
  isPrivate: boolean;
  isArchived: boolean;
}

export type DeployScript = Script<DeployOption, DeployPlugin>;

/**
 * The .deploy script. This script will upsert a Plugin and then creates a new PluginVersion
 * @param pluginClient        the Public API {@link PluginsClient}
 * @param pluginVersionClient the Public API {@link PluginVersionsClient}
 */
export default function deploy(pluginClient: PluginsClient, pluginVersionClient: PluginVersionsClient): DeployScript {
  return async (option: DeployOption): Promise<DeployPlugin> => {
    // Upsert Plugin
    const upsertOption: CreatePluginResource = {
      UniqueName: option.name,
      FriendlyName: option.friendlyName,
      Description: option.description,
    };
    const plugin = await pluginClient.upsert(upsertOption);

    // Create new PluginVersion
    const createOption: CreatePluginVersionResource = {
      Version: option.version,
      PluginUrl: option.url,
    };
    if (typeof option.isPrivate !== 'undefined') {
      createOption.Private = option.isPrivate;
    }
    if (option.changelog) {
      createOption.Changelog = option.changelog;
    }
    const version = await pluginVersionClient.create(plugin.sid, createOption);

    return {
      pluginSid: plugin.sid,
      pluginVersionSid: version.sid,
      name: plugin.unique_name,
      version: version.version,
      url: version.plugin_url,
      friendlyName: plugin.friendly_name,
      description: plugin.description,
      changelog: version.changelog,
      isPrivate: version.private,
      isArchived: plugin.archived,
    };
  };
}
