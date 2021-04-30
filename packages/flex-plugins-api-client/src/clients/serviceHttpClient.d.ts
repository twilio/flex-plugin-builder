import { Realm } from 'flex-plugins-utils-env';
import { HttpClient } from 'flex-plugin-utils-http';
export interface Pagination {
    pageSize?: number;
    page?: number;
    pageToken?: string;
}
export interface Meta {
    page: number;
    page_size: number;
    first_page_url: string;
    previous_page_url: string | null;
    url: string;
    next_page_url?: string;
    key: string;
    next_token?: string;
    previous_token?: string;
}
export interface PaginationMeta {
    meta: Meta;
}
export default abstract class ServiceHttpClient extends HttpClient {
    protected static realms: Realm[];
    /**
     * Returns the realm if provided
     */
    protected static getRealm: (realm?: Realm | undefined) => string;
    /**
     * List API endpoint with pagination support
     * @param uri           the uri endpoint
     * @param responseKey  response key
     * @param pagination    the request option
     */
    list<R extends PaginationMeta>(uri: string, responseKey: string, pagination?: Pagination): Promise<R>;
}
