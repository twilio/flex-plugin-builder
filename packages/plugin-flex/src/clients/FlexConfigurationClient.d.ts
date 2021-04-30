import { ConfigurationContext, ConfigurationInstance } from 'twilio/lib/rest/flexApi/v1/configuration';
export interface FlexConfigurationClientOptions {
    accountSid: string;
    username: string;
    password: string;
    realm?: 'dev' | 'stage';
}
/**
 * Wrapper Twilio Flex Configuration Public API
 */
export default class FlexConfigurationClient {
    private client;
    private options;
    constructor(client: ConfigurationContext, options: FlexConfigurationClientOptions);
    /**
     * Fetches the {@link ConfigurationInstance}
     */
    fetch(): Promise<ConfigurationInstance>;
    /**
     * Fetches the Serverless ServiceSid
     */
    getServerlessSid(): Promise<string | null>;
    /**
     * Registers Serverless sid
     * @param serviceSid the sid to register
     */
    registerServerlessSid(serviceSid: string): Promise<ConfigurationInstance>;
    /**
     * Removes a Serverless sid
     * @param serviceSid the sid to remove
     */
    unregisterServerlessSid(serviceSid: string): Promise<ConfigurationInstance>;
    /**
     * Updates the serverless sids
     * @param sids  the serverless sid to update
     * @private
     */
    private updateServerlessSids;
}
