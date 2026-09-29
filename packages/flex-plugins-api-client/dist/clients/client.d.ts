import { HttpClient, OptionalHttpClientConfig } from '@twilio/flex-dev-utils/dist/http';
export declare type PluginServiceHttpOption = OptionalHttpClientConfig;
/**
 * An implementation of the raw {@link HttpClient} but made for PluginService
 */
export default class PluginServiceHttp extends HttpClient {
    private static version;
    constructor(username: string, password: string, options?: PluginServiceHttpOption);
}
