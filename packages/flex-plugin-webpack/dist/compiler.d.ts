import { SyncHook } from 'tapable';
import webpack, { Compiler as WebpackCompiler, Configuration } from 'webpack';
import { OnCompileCompletePayload } from './devServer/ipcServer';
import { OnRemotePlugins } from './devServer/pluginServer';
import CompilerHooks = webpack.compilation.CompilerHooks;
interface Hook extends CompilerHooks {
    tsCompiled: SyncHook<string[], string[]>;
}
export interface Compiler extends WebpackCompiler {
    hooks: Hook;
}
declare type OnCompile = (payload: OnCompileCompletePayload) => void;
interface CompilerRenderer {
    onCompile: OnCompile;
    onRemotePlugins: OnRemotePlugins;
}
declare const _default: (config: Configuration, devServer: boolean, isJavaScriptServer: boolean, onCompile: OnCompile) => Compiler;
/**
 * Creates a webpack compiler
 *
 * @param config      the Webpack configuration
 * @param devServer   whether to run the devserver or not
 * @param type        the webpack compile type
 * @param localPlugins  the names of plugins to run locally
 */
export default _default;
/**
 * Prints the errors and warnings or a successful message when compilation finishes
 * @param port    the port the server is running on
 * @param localPlugins the local plugins running
 * @param showSuccessMsg    whether to show succecss message or not
 * @param hasRemote         whether there are any remote plugins
 */
export declare const compilerRenderer: (port: number, localPlugins: string[], showSuccessMsg: boolean, hasRemote: boolean) => CompilerRenderer;
