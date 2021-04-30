import ServiceHttpClient, { PaginationMeta } from './serviceHttpClient';
export interface ConfiguredPluginResource {
    plugin_sid: string;
    plugin_version_sid: string;
    configuration_sid: string;
    unique_name: string;
    version: string;
    plugin_url: string;
    phase: number;
    private: boolean;
    date_created: string;
}
declare const RESPONSE_KEY = "plugins";
export interface ConfiguredPluginResourcePage extends PaginationMeta {
    [RESPONSE_KEY]: ConfiguredPluginResource[];
}
/**
 * Configured Plugin Configuration Public API Http client for the Configuration resource
 * @link https://www.twilio.com/docs/flex/plugins/api/plugin-configuration
 */
export default class ConfiguredPluginsClient {
    private readonly client;
    constructor(client: ServiceHttpClient);
    /**
     * Helper method to generate the URI for ConfiguredPlugins
     * @param configId    the configuration identifier
     * @param pluginId    the plugin identifier
     */
    private static getUrl;
    /**
     * Fetches the list of {@link ConfiguredPluginResourcePage}
     * @param configId the config identifier
     */
    list(configId: string): Promise<ConfiguredPluginResourcePage>;
    /**
     * Fetches an instance of the {@link ConfiguredPluginResource}
     * @param configId the config identifier
     * @param id the plugin identifier
     */
    get(configId: string, id: string): Promise<ConfiguredPluginResource>;
}
export {};
