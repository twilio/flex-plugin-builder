export interface UIDependencies {
    react?: string;
    'react-dom'?: string;
}
interface Configuration {
    ui_version: string;
    serverless_service_sids: string[] | null;
    account_sid: string;
    ui_dependencies?: UIDependencies;
}
interface UpdateConfigurationPayload extends Partial<Configuration> {
    account_sid: string;
}
export default class ConfigurationClient {
    static BaseUrl: string;
    private static version;
    private readonly http;
    constructor(username: string, password: string);
    /**
     * Returns the {@link Configuration}
     */
    get: () => Promise<Configuration>;
    /**
     * Updates the Config service
     *
     * @param payload the payload to update
     */
    update: (payload: UpdateConfigurationPayload) => Promise<Configuration>;
    /**
     * Returns the registered Serverless Sids
     */
    getServiceSids: () => Promise<string[]>;
    /**
     * Registers a new sid
     * @param serviceSid
     */
    registerSid: (serviceSid: string) => Promise<Configuration>;
    /**
     * Returns the Flex UI version stored on Configuration service
     */
    getFlexUIVersion: () => Promise<string>;
    /**
     * Returns the Flex UI dependencies stored on the Configuration service
     */
    getUIDependencies: () => Promise<UIDependencies>;
}
export {};
