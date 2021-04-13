import urlJoin from 'url-join';

import ServiceHttpClient, { Pagination, PaginationMeta } from './serviceHttpClient';

export interface ConfigurationResource {
  sid: string;
  account_sid: string;
  name: string;
  description: string;
  archived: boolean;
  date_created: string;
}

const RESPONSE_KEY = 'configurations';

export interface ConfigurationResourcePage extends PaginationMeta {
  [RESPONSE_KEY]: ConfigurationResource[];
}

export interface CreateConfiguredPlugin {
  phase: number;
  plugin_version: string;
}

export interface CreateConfigurationResource {
  Name: string;
  Plugins: CreateConfiguredPlugin[];
  Description?: string;
}

/**
 * Plugin Configuration Public API Http client for the Configuration resource
 * @link https://www.twilio.com/docs/flex/plugins/api/plugin-configuration
 */
export default class ConfigurationsClient {
  private readonly client: ServiceHttpClient;

  constructor(client: ServiceHttpClient) {
    this.client = client;
  }

  /**
   * Helper method to generate the URI for Configurations
   *
   * @param configId  the configuration identifier
   */
  private static getUrl(configId?: string) {
    if (configId) {
      return `Configurations/${configId}`;
    }

    return 'Configurations';
  }

  /**
   * Fetches a list of {@link ConfigurationResource}
   * @param pagination the pagination meta data
   */
  public async list(pagination?: Pagination): Promise<ConfigurationResourcePage> {
    return this.client.list<ConfigurationResourcePage>(ConfigurationsClient.getUrl(), RESPONSE_KEY, pagination);
  }

  /**
   * Fetches the latest {@link ConfigurationResource}
   */
  public async latest(): Promise<ConfigurationResource | null> {
    const list = await this.list();

    return list.configurations[0];
  }

  /**
   * Fetches an instance of the {@link ConfigurationResource}
   * @param configId  the configuration identifier
   */
  public async get(configId: string): Promise<ConfigurationResource> {
    return this.client.get<ConfigurationResource>(ConfigurationsClient.getUrl(configId), { cacheable: true });
  }

  /**
   * Creates a new {@link ConfigurationResource}
   * @param object the {@link CreateConfigurationResource} request
   */
  public async create(object: CreateConfigurationResource): Promise<ConfigurationResource> {
    return this.client.post<ConfigurationResource>(ConfigurationsClient.getUrl(), object);
  }

  /**
   * Archives the {@link ConfigurationResource}
   * @param configId  the configuration identifier to archive
   */
  public async archive(configId: string): Promise<ConfigurationResource> {
    return this.client.post<ConfigurationResource>(urlJoin(ConfigurationsClient.getUrl(configId), 'Archive'), {});
  }
}
