import { Callback } from 'flex-dev-utils';
import { WebpackCompiler } from 'flex-plugin-webpack';
export interface Bundle {
    chunks?: (number | string)[];
    chunkNames?: string[];
    emitted?: boolean;
    isOverSizeLimit?: boolean;
    name: string;
    size: number;
}
interface BuildBundle {
    warnings?: string[];
    bundles: Bundle[];
}
/**
 * Builds the JS and Sourcemap bundles
 * @private
 */
export declare const _handler: (resolve: Callback<BuildBundle>, reject: Callback<Error | string | string[]>) => WebpackCompiler.Handler;
/**
 * Promisify the webpack runner
 * @private
 */
export declare const _runWebpack: () => Promise<BuildBundle>;
/**
 * Builds the bundle
 */
declare const build: (...argv: string[]) => Promise<void>;
export default build;
