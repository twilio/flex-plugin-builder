import ServiceHttpClient, { Pagination, PaginationMeta } from './serviceHttpClient';
export interface PluginResource {
    sid: string;
    account_sid: string;
    unique_name: string;
    description: string;
    friendly_name: string;
    archived: boolean;
    date_created: string;
    date_updated: string;
}
declare const RESPONSE_KEY = "plugins";
export interface PluginResourcePage extends PaginationMeta {
    [RESPONSE_KEY]: PluginResource[];
}
export interface UpdatePluginResource {
    FriendlyName?: string;
    Description?: string;
}
export interface CreatePluginResource extends UpdatePluginResource {
    UniqueName: string;
}
/**
 * Plugin Public API Http client for the Plugin resource
 * @link https://www.twilio.com/docs/flex/plugins/api/plugin
 */
export default class PluginsClient {
    private readonly client;
    constructor(client: ServiceHttpClient);
    /**
     * Helper method to generate the URI for Plugins
     *
     * @param pluginId  the plugin identifier
     */
    private static getUrl;
    /**
     * Fetches the list of {@link PluginResource}
     * @param pagination the pagination meta data
     */
    list(pagination?: Pagination): Promise<PluginResourcePage>;
    /**
     * Fetches an instance of the {@link PluginResource}
     * @param id  the plugin identifier
     */
    get(id: string): Promise<PluginResource>;
    /**
     * Creates a new {@link PluginResource}
     * @param object the {@link CreatePluginResource} request
     */
    create(object: CreatePluginResource): Promise<PluginResource>;
    /**
     * Updates a {@link PluginResource}
     * @param id the plugin identifier
     * @param object the {@link UpdatePluginResource} request
     */
    update(id: string, object: UpdatePluginResource): Promise<PluginResource>;
    /**
     * Upserts a {@link PluginResource}. If no resource is found, then it creates it first, otherwise it will update it
     * @param object the {@link CreatePluginResource} request
     */
    upsert(object: CreatePluginResource): Promise<PluginResource>;
    /**
     * Archives the {@link PluginResource}
     * @param id  the plugin identifier to archive
     */
    archive(id: string): Promise<PluginResource>;
}
export {};
