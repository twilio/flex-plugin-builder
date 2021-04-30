import { Configuration } from 'webpack-dev-server';
import { WebpackType } from '..';
import { Compiler } from '../compiler';
declare const _default: (devCompiler: Compiler, devConfig: Configuration, type: WebpackType) => void;
/**
 * Starts a {@link WebpackDevServer}
 * @param devCompiler the {@link Compiler} compiler
 * @param devConfig the dev {@link Configuration}
 * @param type the {@link WebpackType}
 */
export default _default;
