import { TwilioError } from 'flex-dev-utils/dist/errors';
import { logger, sids } from 'flex-dev-utils';

import {
  ConfigurationsClient,
  ConfiguredPluginsClient,
  CreateConfigurationResource,
  CreateConfiguredPlugin,
  PluginsClient,
  PluginVersionsClient,
  ReleasesClient,
} from '../../clients';
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
  const getVersion = async (name: string, version: string) => {
    const resource =
      version === 'latest' ? await pluginVersionClient.latest(name) : await pluginVersionClient.get(name, version);
    if (!resource) {
      throw new TwilioError(`No plugin version was found for ${name}`);
    }

    return resource;
  };

  return async (option: CreateConfigurationOption): Promise<CreateConfiguration> => {
    logger.debug('Creating configuration with input', option);

    const pluginsValid = option.addPlugins.every((plugin) => {
      const match = plugin.match(pluginRegex);
      return match && match.groups && match.groups.name && match.groups.version;
    });
    if (!pluginsValid) {
      throw new TwilioError('Plugins must be of the format pluginName@version');
    }

    // Change to sids
    option.addPlugins = await Promise.all(
      option.addPlugins.map(async (plugin) => {
        const match = plugin.match(pluginRegex);
        // @ts-ignore
        const { name, version } = match.groups;

        // this is checking whether the plugin exists - better for display error
        await pluginClient.get(name);

        const resource = await getVersion(name, version);
        return `${resource.plugin_sid}@${resource.sid}`;
      }),
    );

    const removeList: string[] = await Promise.all(
      (option.removePlugins || [])
        .map(async (name) => {
          if (sids.looksLikeSid(name)) {
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
    const list: string[] = [];
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
      list.push(...items.plugins.map((p) => `${p.plugin_sid}@${p.plugin_version_sid}`));
      option.addPlugins.forEach((a) => {
        const index = list.findIndex((l) => a.split('@')[0] === l.split('@')[0]);
        if (index > -1) {
          list[index] = a;
        } else {
          list.push(a);
        }
      });
    } else {
      list.push(...option.addPlugins);
    }

    const plugins: CreateConfiguredPlugin[] = await Promise.all(
      list
        .map((plugin) => {
          // @ts-ignore
          const { name, version } = plugin.match(pluginRegex).groups;
          return {
            name,
            version,
          };
        })
        .filter(({ name }) => !removeList.includes(name))
        .map(async ({ name, version }) => {
          // This checks plugin exists
          await pluginClient.get(name);
          const versionResource = await getVersion(name, version);

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
      configuredPluginsPage.plugins.map(async (p) => {
        return {
          pluginSid: p.plugin_sid,
          pluginVersionSid: p.plugin_version_sid,
          name: p.unique_name,
          version: p.version,
          url: p.plugin_url,
          phase: p.phase,
          friendlyName: p.friendly_name,
          description: p.description,
          changelog: p.changelog,
          isPrivate: p.private,
          isArchived: p.plugin_archived || p.plugin_version_archived,
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
