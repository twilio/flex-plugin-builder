import {
  ConfigurationsClient,
  ConfiguredPluginsClient,
  CreateConfigurationResource,
  CreateConfiguredPlugin,
  PluginsClient,
  PluginVersionsClient,
  ReleasesClient,
} from 'flex-plugins-api-client';
import { looksLikeSid } from 'flex-plugin-utils-http';
import { TwilioError } from 'flex-plugins-utils-exception';

import { DeployPlugin } from './deploy';
import { Script } from '.';

const pluginRegex = /^(?<name>[\w-]*)@(?<version>[\w\.-]*)$/;

export interface InstalledPlugin extends DeployPlugin {
  phase: number;
}

export interface CreateConfigurationOption {
  name: string;
  addPlugins: string[];
  removePlugins?: string[];
  description?: string;
  fromConfiguration?: 'active' | string;
}

export interface CreateConfiguration {
  sid: string;
  name: string;
  description: string;
  plugins: InstalledPlugin[];
  dateCreated: string;
}

export type CreateConfigurationScript = Script<CreateConfigurationOption, CreateConfiguration>;

/**
 * The .createConfiguration script. This script will create a Configuration
 * @param pluginClient        the Public API {@link PluginsClient}
 * @param pluginVersionClient the Public API {@link PluginVersionsClient}
 * @param configurationClient the Public API {@link ConfigurationsClient}
 * @param configuredPluginClient the Public API {@link ConfiguredPluginsClient}
 * @param releasesClient the Public API {@link ReleasesClient}
 */
export default function createConfiguration(
  pluginClient: PluginsClient,
  pluginVersionClient: PluginVersionsClient,
  configurationClient: ConfigurationsClient,
  configuredPluginClient: ConfiguredPluginsClient,
  releasesClient: ReleasesClient,
): CreateConfigurationScript {
  return async (option: CreateConfigurationOption): Promise<CreateConfiguration> => {
    const pluginsValid = option.addPlugins.every((plugin) => {
      const match = plugin.match(pluginRegex);
      return match && match.groups && match.groups.name && match.groups.version;
    });
    if (!pluginsValid) {
      throw new TwilioError('Plugins must be of the format pluginName@version');
    }

    const removeList: string[] = await Promise.all(
      (option.removePlugins || [])
        .map(async (name) => {
          if (looksLikeSid(name)) {
            return name;
          }

          const plugin = await pluginClient.get(name);
          if (plugin.unique_name === name) {
            return plugin.sid;
          }

          return '';
        })
        .filter(Boolean),
    );
    const list: string[] = option.addPlugins;
    if (option.fromConfiguration === 'active') {
      const release = await releasesClient.active();
      if (release) {
        option.fromConfiguration = release.configuration_sid;
      } else {
        delete option.fromConfiguration;
      }
    }

    // Fetch existing installed plugins
    if (option.fromConfiguration) {
      const items = await configuredPluginClient.list(option.fromConfiguration);
      const existingPlugins = items.plugins
        .filter(
          (plugin) =>
            !list.some((p) => p.indexOf(`${plugin.unique_name}@`) !== -1 || p.indexOf(`${plugin.plugin_sid}@`) !== -1),
        )
        .map((p) => `${p.plugin_sid}@${p.plugin_version_sid}`);
      list.push(...existingPlugins);
    }

    const plugins: CreateConfiguredPlugin[] = await Promise.all(
      list
        .map((plugin) => {
          // @ts-ignore
          const { name, version } = plugin.match(pluginRegex).groups;
          return {
            name,
            version,
            plugin,
          };
        })
        .filter(({ name }) => !removeList.includes(name))
        .map(async ({ name, version, plugin }) => {
          // This checks plugin exists
          await pluginClient.get(name);

          const versionResource =
            version === 'latest'
              ? await pluginVersionClient.latest(name)
              : await pluginVersionClient.get(name, version);
          if (!versionResource) {
            throw new TwilioError(`No plugin version was found for ${plugin}`);
          }

          return { plugin_version: versionResource.sid, phase: 3 };
        }),
    );

    // Create a Configuration
    const createOption: CreateConfigurationResource = {
      Name: option.name,
      Plugins: plugins,
    };
    if (option.description) {
      createOption.Description = option.description;
    }
    const configuration = await configurationClient.create(createOption);

    // Fetch installed plugins
    const configuredPluginsPage = await configuredPluginClient.list(configuration.sid);
    const installedPlugins: InstalledPlugin[] = await Promise.all(
      configuredPluginsPage.plugins.map(async (installedPlugin) => {
        const plugin = await pluginClient.get(installedPlugin.plugin_sid);
        const version = await pluginVersionClient.get(installedPlugin.plugin_sid, installedPlugin.plugin_version_sid);

        return {
          pluginSid: installedPlugin.plugin_sid,
          pluginVersionSid: installedPlugin.plugin_version_sid,
          name: installedPlugin.unique_name,
          version: installedPlugin.version,
          url: installedPlugin.plugin_url,
          phase: installedPlugin.phase,
          friendlyName: plugin.friendly_name,
          description: plugin.description,
          changelog: version.changelog,
          isPrivate: installedPlugin.private,
          isArchived: plugin.archived || version.archived,
        };
      }),
    );

    return {
      sid: configuration.sid,
      name: configuration.name,
      description: configuration.description,
      plugins: installedPlugins,
      dateCreated: configuration.date_created,
    };
  };
}
