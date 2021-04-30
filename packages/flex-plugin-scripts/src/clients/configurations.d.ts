import { Credential } from 'flex-dev-utils';
import BaseClient from './baseClient';
import { Configuration, UIDependencies } from './configuration-types';
interface UpdateConfigurationPayload extends Partial<Configuration> {
    account_sid: string;
}
export default class ConfigurationClient extends BaseClient {
    static BaseUrl: string;
    private static version;
    constructor(auth: Credential);
    /**
     * Gets the base URL
     */
    static getBaseUrl: () => string;
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
