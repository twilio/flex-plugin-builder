import ServerlessClient from './serverless-client';
export interface ServerlessEnvironment {
    sid: string;
    account_sid: string;
    url: string;
    date_updated: string;
    date_created: string;
    unique_name: string;
    domain_suffix: string;
    domain_name: string;
    build_sid: string;
    service_sid: string;
}
export default class EnvironmentClient {
    static DomainSuffixLength: number;
    private readonly http;
    private readonly serviceSid;
    constructor(http: ServerlessClient, serviceSid: string);
    /**
     * Returns the {@link Environment} that has the same name as the packageName
     *
     * @param create    if set to true, will create an environment if not found
     */
    get: (create?: boolean) => Promise<ServerlessEnvironment>;
    /**
     * Creates an {@link ServerlessEnvironment} with the package name
     */
    create: () => Promise<ServerlessEnvironment>;
    /**
     * Removes the {@link ServerlessEnvironment}
     */
    remove: (sid: string) => Promise<void>;
    /**
     * Fetches the list of {@link ServerlessEnvironment}
     */
    list: () => Promise<ServerlessEnvironment[]>;
}
