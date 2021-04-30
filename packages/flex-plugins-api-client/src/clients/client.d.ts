import { Realm } from 'flex-plugins-utils-env';
import { OptionalHttpConfig } from 'flex-plugin-utils-http';
import ServiceHttpClient from './serviceHttpClient';
export interface PluginServiceHttpOption extends OptionalHttpConfig {
    realm?: Realm;
}
/**
 * An implementation of the raw {@link HttpClient} but made for PluginService
 */
export default class PluginServiceHttp extends ServiceHttpClient {
    private static version;
    constructor(username: string, password: string, options?: PluginServiceHttpOption);
}
