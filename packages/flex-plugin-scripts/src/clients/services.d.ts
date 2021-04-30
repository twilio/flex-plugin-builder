import { Credential } from 'flex-dev-utils';
import BaseClient from './baseClient';
import { Service, ServiceResource } from './serverless-types';
export default class ServiceClient extends BaseClient {
    static BASE_URI: string;
    static NewService: {
        UniqueName: string;
        FriendlyName: string;
    };
    private static version;
    constructor(auth: Credential);
    /**
     * Returns the base URL
     */
    static getBaseUrl: (baseUrl?: string) => string;
    /**
     * Fetches an instance of Serverless service
     *
     * @param sid the service sid
     */
    get: (sid: string) => Promise<Service>;
    /**
     * Fetches the default {@link Service}.
     */
    getDefault: () => Promise<Service>;
    /**
     * Creates a {@link Service} with unique name `default`
     */
    create: () => Promise<Service>;
    /**
     * Fetches the list of {@link Service}
     */
    list: () => Promise<ServiceResource>;
}
