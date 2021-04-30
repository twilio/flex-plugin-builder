import ServiceHttpClient, { Pagination, PaginationMeta } from './serviceHttpClient';
export interface ConfigurationResource {
    sid: string;
    account_sid: string;
    name: string;
    description: string;
    archived: boolean;
    date_created: string;
}
declare const RESPONSE_KEY = "configurations";
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
    private readonly client;
    constructor(client: ServiceHttpClient);
    /**
     * Helper method to generate the URI for Configurations
     *
     * @param configId  the configuration identifier
     */
    private static getUrl;
    /**
     * Fetches a list of {@link ConfigurationResource}
     * @param pagination the pagination meta data
     */
    list(pagination?: Pagination): Promise<ConfigurationResourcePage>;
    /**
     * Fetches the latest {@link ConfigurationResource}
     */
    latest(): Promise<ConfigurationResource | null>;
    /**
     * Fetches an instance of the {@link ConfigurationResource}
     * @param configId  the configuration identifier
     */
    get(configId: string): Promise<ConfigurationResource>;
    /**
     * Creates a new {@link ConfigurationResource}
     * @param object the {@link CreateConfigurationResource} request
     */
    create(object: CreateConfigurationResource): Promise<ConfigurationResource>;
    /**
     * Archives the {@link ConfigurationResource}
     * @param configId  the configuration identifier to archive
     */
    archive(configId: string): Promise<ConfigurationResource>;
}
export {};
