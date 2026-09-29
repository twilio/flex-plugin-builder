import { PaginationMeta } from '@twilio/flex-dev-utils';
import ServerlessClient from './serverless-client';
export interface ServerlessService {
    sid: string;
    account_sid: string;
    url: string;
    date_updated: string;
    date_created: string;
    unique_name: string;
    include_credentials: boolean;
    friendly_name: string;
    links: {
        functions: string;
        assets: string;
        environments: string;
        builds: string;
    };
}
declare const RESPONSE_KEY = "services";
export interface ServerlessServiceResourcePage extends PaginationMeta {
    [RESPONSE_KEY]: ServerlessService[];
}
export default class ServiceClient {
    static NewService: {
        UniqueName: string;
        FriendlyName: string;
    };
    private readonly http;
    constructor(http: ServerlessClient);
    /**
     * Fetches an instance of Serverless service
     *
     * @param sid the service sid
     */
    get: (sid: string) => Promise<ServerlessService>;
    /**
     * Fetches the default {@link Service}.
     */
    getDefault: () => Promise<ServerlessService>;
    /**
     * Creates a {@link Service} with unique name `default`
     */
    create: () => Promise<ServerlessService>;
}
export {};
