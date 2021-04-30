import { Plugin, OnDevServerCrashedPayload } from 'flex-plugin-webpack';
import { WebpackType } from '../config';
import { UserInputPlugin } from '../utils/parser';
interface StartServerOptions {
    port: number;
    remoteAll: boolean;
    type: WebpackType;
}
export interface StartScript {
    port: number;
}
interface Packages {
    plugins: Plugin[];
    pkg: Record<string, string>;
}
/**
 * requires packages
 *
 * @param pluginsPath   the plugins path
 * @param pkgPath       the package path
 * @private
 */
export declare const _requirePackages: (pluginsPath: string, pkgPath: string) => Packages;
/**
 * Update port of a plugin
 * @param port
 * @param name
 */
export declare const _updatePluginPort: (port: number, name: string) => void;
/**
 * Handles server crash
 * @param payload
 */
export declare const _onServerCrash: (payload: OnDevServerCrashedPayload) => void;
/**
 * Starts the webpack dev-server
 * @param port      the port the server is running on
 * @param plugins   the list of plugins user has requested
 * @param type      the webpack type
 * @param remoteAll whether to request all plugins
 * @private
 */
export declare const _startDevServer: (plugins: UserInputPlugin[], options: StartServerOptions) => Promise<StartScript>;
/**
 * Finds the port
 * @param args
 */
export declare const findPortAvailablePort: (...args: string[]) => Promise<number>;
/**
 * Starts the dev-server
 */
export declare const start: (...args: string[]) => Promise<StartScript>;
export default start;
