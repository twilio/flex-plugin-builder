import { Request, Response } from 'express-serve-static-core';
import { FlexConfigurationPlugin } from 'flex-dev-utils/dist/fs';
import { Configuration } from 'webpack-dev-server';
export interface Plugin {
    phase: number;
    name: string;
    src: string;
    version?: string;
}
interface StartServerPlugins {
    local: string[];
    remote: string[];
}
interface StartServerConfig {
    port: number;
    remoteAll: boolean;
}
export declare type OnRemotePlugins = (remotePlugins: Plugin[]) => void;
/**
 * Returns the plugin from the local configuration file
 * @param name  the plugin name
 * @private
 */
export declare const _getLocalPlugin: (name: string) => FlexConfigurationPlugin | undefined;
/**
 * Returns local plugins from  cli/plugins.json
 * @private
 */
export declare const _getLocalPlugins: (port: number, names: string[]) => Plugin[];
/**
 * Generates the response headers
 *
 * @private
 */
export declare const _getHeaders: () => Record<string, string>;
/**
 * Fetches the Plugins from Flex
 *
 * @param token     the JWE Token
 * @param version   the Flex version
 */
export declare const _getRemotePlugins: (token: string, version: string | null | undefined) => Promise<Plugin[]>;
/**
 * Merge local and remote plugins
 * @param localPlugins   the list of local plugins
 * @param remotePlugins  the lost of remote plugins
 * @private
 */
export declare const _mergePlugins: (localPlugins: Plugin[], remotePlugins: Plugin[]) => Plugin[];
/**
 * Basic server to fetch plugins from Flex and return to the local dev-server
 * @param plugins
 * @param config
 * @param onRemotePlugin
 */
export declare const _startServer: (plugins: StartServerPlugins, config: StartServerConfig, onRemotePlugin: OnRemotePlugins) => (req: Request, res: Response) => Promise<void>;
declare const _default: (plugins: StartServerPlugins, webpackConfig: Configuration, serverConfig: StartServerConfig, onRemotePlugin: OnRemotePlugins) => void;
/**
 * Setups up the plugin servers
 * @param plugins
 * @param webpackConfig
 * @param serverConfig
 */
export default _default;
