import ServiceHttpClient, { PaginationMeta } from './serviceHttpClient';

export interface ConfiguredPluginResource {
  plugin_sid: string;
  plugin_version_sid: string;
  configuration_sid: string;
  unique_name: string;
  description: string;
  friendly_name: string;
  plugin_archived: boolean;
  version: string;
  changelog: string;
  plugin_url: string;
  phase: number;
  plugin_version_archived: boolean;
  private: boolean;
  date_created: string;
}

const RESPONSE_KEY = 'plugins';

export interface ConfiguredPluginResourcePage extends PaginationMeta {
  [RESPONSE_KEY]: ConfiguredPluginResource[];
}

/**
 * Configured Plugin Configuration Public API Http client for the Configuration resource
 * @link https://www.twilio.com/docs/flex/plugins/api/plugin-configuration
 */
export default class ConfiguredPluginsClient {
  private readonly client: ServiceHttpClient;

  constructor(client: ServiceHttpClient) {
    this.client = client;
  }

  /**
   * Helper method to generate the URI for ConfiguredPlugins
   * @param configId    the configuration identifier
   * @param pluginId    the plugin identifier
   */
  private static getUrl(configId: string, pluginId?: string) {
    const url = `Configurations/${configId}/Plugins`;
    if (pluginId) {
      return `${url}/${pluginId}`;
    }

    return url;
  }

  /**
   * Fetches the list of {@link ConfiguredPluginResourcePage}
   * @param configId the config identifier
   */
  public async list(configId: string): Promise<ConfiguredPluginResourcePage> {
    return this.client.list<ConfiguredPluginResourcePage>(ConfiguredPluginsClient.getUrl(configId), RESPONSE_KEY);
  }

  /**
   * Fetches an instance of the {@link ConfiguredPluginResource}
   * @param configId the config identifier
   * @param id the plugin identifier
   */
  public async get(configId: string, id: string): Promise<ConfiguredPluginResource> {
    return this.client.get<ConfiguredPluginResource>(ConfiguredPluginsClient.getUrl(configId, id), { cacheable: true });
  }
}
