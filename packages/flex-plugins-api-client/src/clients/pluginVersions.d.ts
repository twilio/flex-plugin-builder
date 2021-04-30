import ServiceHttpClient, { Pagination, PaginationMeta } from './serviceHttpClient';
export interface PluginVersionResource {
    sid: string;
    account_sid: string;
    plugin_sid: string;
    version: string;
    plugin_url: string;
    private: boolean;
    changelog: string;
    archived: boolean;
    date_created: string;
}
export interface PluginVersionResourcePage extends PaginationMeta {
    plugin_versions: PluginVersionResource[];
}
export interface CreatePluginVersionResource {
    Version: string;
    PluginUrl: string;
    Private?: boolean;
    Changelog?: string;
}
/**
 * Plugin Public API Http client for the PluginVersion resource
 * @link https://www.twilio.com/docs/flex/plugins/api/plugin-version
 */
export default class PluginVersionsClient {
    private readonly client;
    constructor(client: ServiceHttpClient);
    /**
     * Helper method to generate the URI for PluginVersion
     * @param pluginId    the plugin identifier
     * @param versionId   the plugin version identifier
     */
    private static getUrl;
    /**
     * Fetches the list of {@link PluginVersionResourcePage}
     * @param pluginId the plugin identifier
     * @param pagination the pagination meta data
     */
    list(pluginId: string, pagination?: Pagination): Promise<PluginVersionResourcePage>;
    /**
     * Fetches the latest {@link PluginVersionResourcePage} by calling the List endpoint and returns the first entry.
     * @param pluginId the plugin identifier
     */
    latest(pluginId: string): Promise<PluginVersionResource | null>;
    /**
     * Fetches an instance of the {@link PluginVersionResource}
     * @param pluginId the plugin identifier
     * @param id the plugin version identifier
     */
    get(pluginId: string, id: string): Promise<PluginVersionResource>;
    /**
     * Creates a new {@link PluginVersionResource}
     * @param pluginId the plugin identifier
     * @param object  the {@link CreatePluginVersionResource} request
     */
    create(pluginId: string, object: CreatePluginVersionResource): Promise<PluginVersionResource>;
    /**
     * Archives the {@link PluginVersionResource}
     * @param pluginId the plugin identifier
     * @param id the plugin version identifier to archive
     */
    archive(pluginId: string, id: string): Promise<PluginVersionResource>;
}
