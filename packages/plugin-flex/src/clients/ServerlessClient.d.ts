import { ServiceInstance, ServiceListInstance, ServiceListInstanceCreateOptions } from 'twilio/lib/rest/serverless/v1/service';
import { Logger } from 'flex-dev-utils';
/**
 * Wrapper Twilio Serverless Public API
 */
export default class ServerlessClient {
    static NewService: ServiceListInstanceCreateOptions;
    static timeoutMsec: number;
    static pollingIntervalMsec: number;
    private client;
    private logger;
    constructor(client: ServiceListInstance, logger: Logger);
    /**
     * Returns a service instance
     * @param serviceSid
     */
    getService(serviceSid: string): Promise<ServiceInstance>;
    /**
     * Lists all services
     */
    listServices(): Promise<ServiceInstance[]>;
    /**
     * Creates a service instance
     */
    getOrCreateDefaultService(): Promise<ServiceInstance>;
    /**
     * Updates the service name
     * @param serviceSid  the service sid to update
     */
    updateServiceName(serviceSid: string): Promise<ServiceInstance>;
    /**
     * Determines if the given plugin has a legacy (v0.0.0) bundle
     * @param serviceSid  the service sid
     * @param pluginName  the plugin name
     */
    hasLegacy(serviceSid: string, pluginName: string): Promise<boolean>;
    /**
     * Removes the legacy bundle (v0.0.0)
     * @param serviceSid  the service sid
     * @param pluginName  the plugin name
     */
    removeLegacy(serviceSid: string, pluginName: string): Promise<void>;
    /**
     * Fetches the {@link BuildInstance}
     * @param serviceSid  the service sid
     * @param pluginName  the plugin name
     */
    private getBuildAndEnvironment;
    /**
     * Creates a new {@link BuildInstance}
     * @param serviceSid  the service sid
     * @param data the {@link BuildListInstanceCreateOptions}
     */
    private createBuild;
    /**
     * Internal method to determine if the build has a legacy bundle
     * @param build   the {@link BuildInstance}
     * @param pluginName the plugin name
     * @private
     */
    private getLegacyAsset;
}
