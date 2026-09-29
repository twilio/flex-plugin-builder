import { ServiceInstance, ServiceListInstance, ServiceListInstanceCreateOptions } from 'twilio/lib/rest/serverless/v1/service';
import { BuildInstance, BuildListInstanceCreateOptions } from 'twilio/lib/rest/serverless/v1/service/build';
import { Logger } from '@twilio/flex-dev-utils';
import { EnvironmentInstance } from 'twilio/lib/rest/serverless/v1/service/environment';
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
     * Creates a {@link BuildInstance} and deploys/activates it
     * @param serviceSid  the serviceSid the {@link BuildInstance} belongs to
     * @param pluginName the plugin name that the build belongs to
     * @param request   the {@link BuildListInstanceCreateOptions} option
     */
    createBuildAndDeploy(serviceSid: string, pluginName: string, request: BuildListInstanceCreateOptions): Promise<void>;
    /**
     * Returns the {@link BuildInstance} belonging to the plugin name
     * @param serviceSid  the service sid
     * @param pluginName  the plugin name
     */
    getBuild(serviceSid: string, pluginName: string): Promise<BuildInstance | undefined>;
    /**
     * Deletes the {@link EnvironmentInstance}
     * @param serviceSid   the service sid
     * @param environment  the environment sid
     */
    deleteEnvironment(serviceSid: string, environmentSid: string): Promise<boolean>;
    /**
     * Returns the {@link EnvironmentInstance}
     * @param serviceSid  the service sid
     * @param pluginName  the plugin name
     */
    getEnvironment(serviceSid: string, pluginName: string): Promise<EnvironmentInstance | null>;
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
