import { NextFunction, Request, Response } from 'express-serve-static-core';
import { FlexConfigurationPlugin } from '@twilio/flex-dev-utils/dist/fs';
import { Configuration, Port } from 'webpack-dev-server';
export declare const PLUGIN_INPUT_PARSER_REGEX: RegExp;
export interface Plugin {
    phase: number;
    name: string;
    src: string;
    version?: string;
}
interface StartServerPlugins {
    local: string[];
    remote: string[];
    versioned: string[];
}
interface StartServerConfig {
    port: Port;
    remoteAll: boolean;
}
export interface PluginsConfig {
    [pluginName: string]: {
        port: number;
    };
}
export declare type OnRemotePlugins = (remotePlugins: Plugin[]) => void;
export declare const JWE_TOKEN_LIMIT = 3900;
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
export declare const _getLocalPlugins: (port: Port, names: string[]) => Plugin[];
/**
 * Returns versioned plugins from the CLI
 *
 * @param names
 * @returns
 */
export declare const _getRemoteVersionedPlugins: (names: string[]) => Plugin[];
/**
 * Merge local and remote plugins
 * @param localPlugins   the list of local plugins
 * @param remotePlugins  the lost of remote plugins
 * @private
 */
export declare const _mergePlugins: (localPlugins: Plugin[], remotePlugins: Plugin[], versionedPlugins: Plugin[]) => Plugin[];
/**
 * Generates the response headers
 *
 * @private
 */
export declare const _getHeaders: () => Record<string, string>;
/**
 * Forward the request to Flex to fetch the list of active plugins or render the plugin bundle
 * @param token JWE token
 * @param path Flex endpoint
 * @param version Flex UI Version
 * @returns Data returned by Flex
 * @private
 */
export declare const _makeRequestToFlex: (token: string, path: string, version?: string | null | undefined) => Promise<string>;
/**
 * Split Large token to chunks
 * @param token JWE token
 * @param length chunk length
 * @returns Chunks of the token
 * @private
 */
export declare const splitTokenToChunks: (token: string, length: number) => string[];
/**
 * Combine chunks to on JWE token
 * @param cookes request cookies
 * @param length chunk length
 * @returns JWE token
 * @private
 */
export declare const combineJweToken: (cookies: {
    [key: string]: string;
}) => string;
/**
 * Common middleware that validates the request data
 */
export declare const _requestValidator: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Basic server to fetch plugins from Flex and return to the local dev-server
 * @param plugins
 * @param config
 * @param onRemotePlugin
 */
export declare const _fetchPluginsServer: (plugins: StartServerPlugins, config: StartServerConfig, onRemotePlugin: OnRemotePlugins) => (req: Request, res: Response) => Promise<void>;
/**
 * Basic server to fetch plugin bundle content from Flex and return to the local dev-server
 */
export declare const _renderPluginServer: (req: Request, res: Response) => Promise<void>;
declare const _default: (plugins: StartServerPlugins, webpackConfig: Configuration, serverConfig: StartServerConfig, onRemotePlugin: OnRemotePlugins, pluginsConfig: PluginsConfig) => void;
/**
 * Setups up the plugin servers
 * @param plugins
 * @param webpackConfig
 * @param serverConfig
 */
export default _default;
