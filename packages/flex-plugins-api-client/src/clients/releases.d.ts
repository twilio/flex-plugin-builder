import ServiceHttpClient, { Pagination, PaginationMeta } from './serviceHttpClient';
export interface ReleaseResource {
    sid: string;
    account_sid: string;
    configuration_sid: string;
    date_created: string;
}
declare const RESPONSE_KEY = "releases";
export interface ReleaseResourcePage extends PaginationMeta {
    [RESPONSE_KEY]: ReleaseResource[];
}
export interface CreateReleaseResource {
    ConfigurationId: string;
}
/**
 * Plugin Releases Client Public API Http client for the Release resource
 * @url https://www.twilio.com/docs/flex/plugins/api/release
 */
export default class ReleasesClient {
    private readonly client;
    constructor(client: ServiceHttpClient);
    /**
     * Helper method to generate the URI for Releases
     * @param releaseId    the release identifier
     */
    private static getUrl;
    /**
     * Fetches the list of {@link ReleaseResourcePage}
     * @param pagination the pagination meta data
     */
    list(pagination?: Pagination): Promise<ReleaseResourcePage>;
    /**
     * Fetches the active {@link ReleaseResource}
     */
    active(): Promise<ReleaseResource | null>;
    /**
     * Fetches an instance of the {@link ReleaseResource}
     * @param releaseId the release identifier
     */
    get(releaseId: string): Promise<ReleaseResource>;
    /**
     * Creates a new {@link ReleaseResource}
     * @param object the {@link CreateReleaseResource} request
     */
    create(object: CreateReleaseResource): Promise<ReleaseResource>;
}
export {};
