import { Credential } from 'flex-dev-utils';
import Http, { ContentType, HttpConfig } from './http';
export interface BaseClientOptions {
    contentType: ContentType;
}
export default abstract class BaseClient {
    static userAgent: string;
    private static realms;
    protected readonly config: HttpConfig;
    protected readonly http: Http;
    protected constructor(auth: Credential, baseUrl: string, options?: BaseClientOptions);
    /**
     * Returns the base URL
     */
    static getBaseUrl: (subDomain: string, version: string) => string;
    /**
     * Constructs user agent with core
     * plugin builder packages
     */
    static getUserAgent(packages?: string[]): string;
}
