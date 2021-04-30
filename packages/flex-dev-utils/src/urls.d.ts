import url from 'url';
export interface ServiceUrl {
    url: string;
    port: number;
    host: string;
}
interface InternalServiceUrls {
    local: ServiceUrl;
    network: ServiceUrl;
}
export declare const DEFAULT_PORT = 3000;
/**
 * Returns the default port
 * @param port  optional port parameter
 */
export declare const getDefaultPort: (port?: string | undefined) => number;
/**
 * Finds the first available
 *
 * @param startPort
 */
export declare const findPort: (startPort?: number) => Promise<number>;
/**
 * Returns the local and network urls
 * @param port  the port the server is running on
 */
export declare const getLocalAndNetworkUrls: (port: number) => InternalServiceUrls;
export default url;
